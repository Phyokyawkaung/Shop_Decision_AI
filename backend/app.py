from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
from swiplserver import PrologMQI

from database import (
    get_product,
    get_product_by_id,
    get_shipping_methods,
    get_suppliers,
    get_supplier_product,
    get_shipping_method,
    get_inventory,
    get_recent_sales,
    search_product_records,
    get_all_product_records,
    get_inventory_overview,
    get_dashboard_stats,
    save_analysis,
    get_analysis_history,
    get_analysis_count,
)

from exchange_rate import get_thb_to_mmk_rate

app = Flask(__name__)
CORS(app)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PROLOG_DIR = PROJECT_ROOT / "Prolog"
MAIN_PL = PROLOG_DIR / "main.pl"


def prolog_atom(value: str) -> str:
    escaped = str(value).replace("'", "''")
    return f"'{escaped}'"


def load_inventory_into_prolog(
    prolog,
    product_name: str,
    product_id: int,
):
    prolog.query(
        "retractall(inventory_data(_, _, _))"
    )

    prolog.query(
        "retractall(sales_data(_, _))"
    )

    inventory = get_inventory(product_id)

    if inventory is None:
        return False

    current_stock = int(
        inventory["current_stock"]
    )

    safety_stock = int(
        inventory["safety_stock"]
    )

    product_atom = prolog_atom(product_name)

    prolog.query(
        f"assertz(inventory_data("
        f"{product_atom}, "
        f"{current_stock}, "
        f"{safety_stock}"
        f"))"
    )

    sales = get_recent_sales(product_id)

    for sale in sales:
        quantity_sold = int(
            sale["quantity_sold"]
        )

        prolog.query(
            f"assertz(sales_data("
            f"{product_atom}, "
            f"{quantity_sold}"
            f"))"
        )

    return True


def load_database_into_prolog(
    prolog,
    product_name: str,
):
    product = get_product(product_name)

    if product is None:
        raise ValueError(
            f"Product not found: {product_name}"
        )

    # supplier/6
    prolog.query(
        "retractall("
        "supplier(_, _, _, _, _, _)"
        ")"
    )

    prolog.query(
        "retractall(shipping(_, _, _))"
    )

    product_atom = prolog_atom(product_name)

    suppliers = get_suppliers(
        product["id"]
    )

    for supplier in suppliers:
        supplier_atom = prolog_atom(
            supplier["name"]
        )

        price_thb = float(
            supplier["price_thb"]
        )

        moq = int(
            supplier["moq"]
        )

        rating = float(
            supplier["rating"]
        )

        trust_score = int(
            supplier["trust_score"]
        )

        prolog.query(
            f"assertz(supplier("
            f"{supplier_atom}, "
            f"{product_atom}, "
            f"{price_thb}, "
            f"{moq}, "
            f"{rating}, "
            f"{trust_score}"
            f"))"
        )

    shipping_methods = get_shipping_methods()

    for method in shipping_methods:
        shipping_atom = prolog_atom(
            method["name"]
        )

        cost_per_kg = float(
            method["cost_thb_per_kg"]
        )

        delivery_days = int(
            method["delivery_days"]
        )

        prolog.query(
            f"assertz(shipping("
            f"{shipping_atom}, "
            f"{cost_per_kg}, "
            f"{delivery_days}"
            f"))"
        )

    return product


def get_recommendation(
    product: str,
    quantity: int,
    urgency: str,
    selling_price_mmk: float,
):
    exchange_data = (
        get_thb_to_mmk_rate()
    )

    thb_to_mmk = float(
        exchange_data["rate"]
    )

    with PrologMQI() as mqi:
        with mqi.create_thread() as prolog:

            prolog.query(
                f"consult('{MAIN_PL.as_posix()}')"
            )

            product_data = (
                load_database_into_prolog(
                    prolog,
                    product,
                )
            )
            supplier_rows = get_suppliers(
                product_data["id"]
            )
            inventory_available = (
                load_inventory_into_prolog(
                    prolog,
                    product,
                    product_data["id"],
                )
            )

            weight_per_item = float(
                product_data["weight_kg"]
            )

            product_atom = prolog_atom(
                product
            )

            urgency_atom = prolog_atom(
                urgency
            )

            query = f"""
                best_recommendation(
                    {product_atom},
                    {quantity},
                    {weight_per_item},
                    {selling_price_mmk},
                    {thb_to_mmk},
                    {urgency_atom},
                    Supplier,
                    Shipping,
                    Margin,
                    Score
                )
            """

            try:
                result = prolog.query(query)

                print("\n========== PROLOG RESULT ==========")
                print(result)
                print("===================================\n")

            except Exception as error:
                print("\n========== PROLOG ERROR ===========")
                print(type(error).__name__)
                print(error)
                print("===================================\n")
                raise

            recommendation = result[0]

            supplier_name = (
                recommendation["Supplier"]
            )

            shipping_name = (
                recommendation["Shipping"]
            )

            supplier_atom = prolog_atom(
                supplier_name
            )

            shipping_atom = prolog_atom(
                shipping_name
            )

            margin = float(
                recommendation["Margin"]
            )

            shipping_query = f"""
                shipping(
                    {shipping_atom},
                    ShippingCostPerKg,
                    LeadTimeDays
                )
            """

            shipping_result = (
                prolog.query(
                    shipping_query
                )
            )

            if shipping_result:
                lead_time_days = int(
                    shipping_result[0][
                        "LeadTimeDays"
                    ]
                )
            else:
                lead_time_days = 0

            reason_query = f"""
                recommendation_reason(
                    {product_atom},
                    {quantity},
                    {weight_per_item},
                    {selling_price_mmk},
                    {thb_to_mmk},
                    {urgency_atom},
                    {supplier_atom},
                    {shipping_atom},
                    {margin},
                    Reason
                )
            """

            reason_result = (
                prolog.query(
                    reason_query
                )
            )

            reasons = []

            if reason_result:
                raw_reason = reason_result[0].get("Reason", [])

                if isinstance(raw_reason, list):
                    reasons = [str(reason) for reason in raw_reason]
                else:
                    reasons = [str(raw_reason)]

            inventory_payload = None

            if inventory_available:
                inventory_query = f"""
                    reorder_needed(
                        {product_atom},
                        {lead_time_days},
                        Recommendation,
                        CurrentStock,
                        AverageSales
                    )
                """

                inventory_result = (
                    prolog.query(
                        inventory_query
                    )
                )

                if inventory_result:
                    inv = (
                        inventory_result[0]
                    )

                    inventory_row = (
                        get_inventory(
                            product_data["id"]
                        )
                    )

                    safety_stock = float(
                        inventory_row[
                            "safety_stock"
                        ]
                    )

                    average_sales = float(
                        inv["AverageSales"]
                    )

                    inventory_recommendation = (
                        str(
                            inv[
                                "Recommendation"
                            ]
                        )
                    )

                    reorder_point = (
                        average_sales
                        * lead_time_days
                        + safety_stock
                    )

                    inventory_payload = {
                        "current_stock": int(
                            inv["CurrentStock"]
                        ),
                        "average_daily_sales": (
                            average_sales
                        ),
                        "reorder_point": (
                            reorder_point
                        ),
                        "recommendation": (
                            inventory_recommendation
                        ),
                        "status": (
                            "REORDER"
                            if inventory_recommendation
                            == "reorder"
                            else "OK"
                        ),
                    }

            supplier_data = (
                get_supplier_product(
                    product_data["id"],
                    supplier_name,
                )
            )

            shipping_data = (
                get_shipping_method(
                    shipping_name
                )
            )

            if supplier_data is None:
                raise ValueError(
                    "Supplier data not found."
                )

            if shipping_data is None:
                raise ValueError(
                    "Shipping data not found."
                )

            product_cost_thb = (
                float(
                    supplier_data["price_thb"]
                )
                * quantity
            )

            total_weight = (
                weight_per_item
                * quantity
            )

            shipping_cost_thb = (
                float(
                    shipping_data[
                        "cost_thb_per_kg"
                    ]
                )
                * total_weight
            )

            total_cost_thb = (
                product_cost_thb
                + shipping_cost_thb
            )

            total_cost_mmk = (
                total_cost_thb
                * thb_to_mmk
            )

            expected_revenue_mmk = (
                selling_price_mmk
                * quantity
            )

            net_profit_mmk = (
                expected_revenue_mmk
                - total_cost_mmk
            )
            supplier_comparison = []

            for supplier in supplier_rows:
                supplier_comparison.append({
                    "supplier": supplier["name"],
                    "price_thb": round(
                        float(supplier["price_thb"]),
                        2,
                    ),
                    "moq": int(
                        supplier["moq"]
                    ),
                    "rating": round(
                        float(supplier["rating"]),
                        2,
                    ),
                    "trust_score": int(
                        supplier["trust_score"]
                    ),
                    "selected": (
                        supplier["name"]
                        == supplier_name
                    ),
                })

            return {
                "product": {
                    "id": product_data[
                        "id"
                    ],
                    "product_name": (
                        product_data["name"]
                    ),
                    "category": (
                        product_data["category"]
                    ),
                    "weight_kg": (
                        weight_per_item
                    ),
                },
                                
                "supplier_comparison": supplier_comparison,
                
                "recommendation": {
                    "supplier": supplier_name,
                    "shipping": shipping_name,
                    "profit_margin": round(margin, 2),
                    "estimated_profit_mmk": round(net_profit_mmk, 2),
                    "ai_score": round(float(recommendation["Score"]), 2),
                    "lead_time_days": lead_time_days,
                },

                "cost_analysis": {
                    "product_cost_thb": round(product_cost_thb, 2),
                    "shipping_cost_thb": round(shipping_cost_thb, 2),
                    "total_cost_thb": round(total_cost_thb, 2),
                    "exchange_rate": round(thb_to_mmk, 2),
                    "total_cost_mmk": round(total_cost_mmk, 2),
                    "expected_revenue_mmk": round(expected_revenue_mmk, 2),
                    "net_profit_mmk": round(net_profit_mmk, 2),
                    "quantity": quantity,
                    "selling_price_mmk": round(selling_price_mmk, 2),
                    "urgency": urgency,
                },

                "inventory": (
                    inventory_payload
                ),

                "reasons": reasons,

                "exchange_rate": (
                    thb_to_mmk
                ),

                "exchange_rate_info": (
                    exchange_data
                ),

            }


# ==========================================================
# API
# ==========================================================


@app.get("/api/health")
def health():
    return jsonify({
        "status": "ok",
        "service": "ShopAI backend",
    })


@app.get("/api/products/search")
def search_products_api():
    try:
        query = request.args.get(
            "q",
            "",
        )

        return jsonify(
            search_product_records(
                query
            )
        )

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


@app.get("/api/products")
def get_all_products_api():
    try:
        return jsonify(
            get_all_product_records()
        )

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


@app.get("/api/products/<int:product_id>")
def get_product_api(product_id):
    try:
        product = get_product_by_id(
            product_id
        )

        if product is None:
            return jsonify({
                "error": "Product not found"
            }), 404

        suppliers = get_suppliers(
            product_id
        )

        result = {
            "id": product["id"],
            "product_name": product["name"],
            "category": product["category"],
            "weight_kg": product["weight_kg"],
        }

        if suppliers:
            supplier = suppliers[0]

            result.update({
                "supplier_name": (
                    supplier["name"]
                ),
                "price_thb": (
                    supplier["price_thb"]
                ),
                "moq": supplier["moq"],
                "rating": (
                    supplier["rating"]
                ),
                "trust_score": (
                    supplier["trust_score"]
                ),
            })

        return jsonify(result)

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


@app.post("/api/analyze")
def analyze_api():
    try:
        data = request.get_json(
            silent=True
        )

        if not data:
            return jsonify({
                "error": (
                    "JSON request body required"
                )
            }), 400

        product_id = int(
            data["product_id"]
        )

        quantity = int(
            data["quantity"]
        )

        selling_price_mmk = float(
            data["selling_price_mmk"]
        )

        urgency = str(
            data.get(
                "urgency",
                "normal",
            )
        ).lower()

        if quantity <= 0:
            return jsonify({
                "error": (
                    "Quantity must be "
                    "greater than 0"
                )
            }), 400

        if selling_price_mmk <= 0:
            return jsonify({
                "error": (
                    "Selling price must be "
                    "greater than 0"
                )
            }), 400

        if urgency not in (
            "normal",
            "urgent",
        ):
            return jsonify({
                "error": (
                    "Urgency must be "
                    "normal or urgent"
                )
            }), 400

        product = get_product_by_id(
            product_id
        )

        if product is None:
            return jsonify({
                "error": "Product not found"
            }), 404

        result = get_recommendation(
            product=product["name"],
            quantity=quantity,
            selling_price_mmk=(
                selling_price_mmk
            ),
            urgency=urgency,
        )
        
        print("\n========== FINAL API RESULT ==========")
        print(result)
        print("======================================\n")
        
        if result is None:
            return jsonify({
                "error": (
                    "No suitable "
                    "recommendation found"
                )
            }), 422

        decision = (
            "IMPORT"
            if result["recommendation"]["profit_margin"] >= 20
            else "REVIEW"
        )

        save_analysis(
            product_id=product_id,
            supplier=result["recommendation"]["supplier"],
            shipping=result["recommendation"]["shipping"],
            quantity=quantity,
            selling_price_mmk=selling_price_mmk,
            profit_margin=result["recommendation"]["profit_margin"],
            ai_score=result["recommendation"]["ai_score"],
            decision=decision,
        )
        return jsonify(result)

    except KeyError as error:
        return jsonify({
            "error": (
                f"Missing field: "
                f"{error.args[0]}"
            )
        }), 400

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400

    except Exception as error:
        import traceback

        print("\n========== ANALYZE ERROR ==========")
        traceback.print_exc()
        print("===================================\n")

        return jsonify({
            "error": str(error)
        }), 500

@app.get("/api/inventory")
def inventory_api():
    try:
        return jsonify({
            "inventory": get_inventory_overview(),
            "decision_log": get_analysis_history(),
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500

@app.get("/api/dashboard")
def dashboard_api():
    try:
        history = get_analysis_history(1)

        if history:
            latest = history[0]

            recent_analysis = {
                "product_id": latest["product_id"],
                "product_name": latest["product_name"],
                "supplier_name": latest["supplier"],
                "shipping_method": latest["shipping"],
                "profit_margin": latest["profit_margin"],
                "quantity": latest["quantity"],
                "selling_price_mmk": latest["selling_price_mmk"],
                "urgency": "normal",
            }
        else:
            recent_analysis = {
                "product_id": None,
                "product_name": "No analysis yet",
                "supplier_name": "-",
                "shipping_method": "-",
                "profit_margin": 0,
                "quantity": 0,
                "selling_price_mmk": 0,
                "urgency": "normal",
            }

        return jsonify({
            "stats": get_dashboard_stats(),
            "recent_analysis": recent_analysis,
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True,
    )