from pathlib import Path

from swiplserver import PrologMQI

from database import (
    get_product,
    get_shipping_methods,
    get_suppliers,
    get_supplier_product,
    get_shipping_method,
    get_inventory,
    get_recent_sales,
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PROLOG_DIR = PROJECT_ROOT / "Prolog"
MAIN_PL = PROLOG_DIR / "main.pl"

def load_inventory_into_prolog(
    prolog,
    product_name: str,
    product_id: int,
):
    """
    Load inventory and sales history from MariaDB
    into Prolog.
    """

    prolog.query(
        "retractall(inventory_data(_, _, _))"
    )

    prolog.query(
        "retractall(sales_data(_, _))"
    )

    inventory = get_inventory(product_id)

    if inventory is None:
        raise ValueError(
            f"No inventory record found for {product_name}"
        )

    current_stock = int(
        inventory["current_stock"]
    )

    safety_stock = int(
        inventory["safety_stock"]
    )

    prolog.query(
        f"assertz(inventory_data("
        f"{product_name}, "
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
            f"{product_name}, "
            f"{quantity_sold}"
            f"))"
        )
def load_database_into_prolog(prolog, product_name: str):
    """
    Load supplier and shipping data from MariaDB
    into the Prolog knowledge base.
    """

    product = get_product(product_name)

    if product is None:
        raise ValueError(f"Product not found: {product_name}")

    # Remove dynamically loaded facts from previous runs.
    prolog.query("retractall(supplier(_, _, _, _, _))")
    prolog.query("retractall(shipping(_, _, _))")

    # --------------------------------------------------
    # Load suppliers from MariaDB
    # --------------------------------------------------

    suppliers = get_suppliers(product["id"])

    for supplier in suppliers:
        name = supplier["name"]
        price_thb = float(supplier["price_thb"])
        moq = int(supplier["moq"])
        rating = float(supplier["rating"])

        prolog.query(
            f"assertz(supplier("
            f"{name}, "
            f"{product_name}, "
            f"{price_thb}, "
            f"{moq}, "
            f"{rating}"
            f"))"
        )

    # --------------------------------------------------
    # Load shipping methods from MariaDB
    # --------------------------------------------------

    shipping_methods = get_shipping_methods()

    for method in shipping_methods:
        name = method["name"]
        cost_per_kg = float(method["cost_thb_per_kg"])
        delivery_days = int(method["delivery_days"])

        prolog.query(
            f"assertz(shipping("
            f"{name}, "
            f"{cost_per_kg}, "
            f"{delivery_days}"
            f"))"
        )

    return product


def get_recommendation(
    product: str,
    quantity: int,
    urgency: str,
    thb_to_mmk: float = 100,
    
):
    
    """
    Get the best recommendation and its reasoning
    from the Prolog engine.
    """

    with PrologMQI() as mqi:
        with mqi.create_thread() as prolog:

            # Load Prolog rules.
            prolog.query(
                f"consult('{MAIN_PL.as_posix()}')"
            )

            # Load current data from MariaDB.
            product_data = load_database_into_prolog(
                prolog,
                product,
            )
            load_inventory_into_prolog(
                prolog,
                product,
                product_data["id"],
            )

            # Product information comes from the database.
            weight_per_item = float(
                product_data["weight_kg"]
            )

            selling_price_mmk = float(
                product_data["selling_price_mmk"]
            )

            # Escape text for Prolog atoms.
            product_atom = product.replace("'", "''")
            urgency_atom = urgency.replace("'", "''")

            # --------------------------------------------------
            # Ask Prolog for the best recommendation
            # --------------------------------------------------

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

            result = prolog.query(query)

            if not result:
                return {
                    "recommendation": [],
                    "reasons": [],
                }

            recommendation = result[0]

            supplier_name = recommendation["Supplier"]
            shipping_name = recommendation["Shipping"]
            margin = float(recommendation["Margin"])

            # --------------------------------------------------
            # Ask Prolog why it made that recommendation
            # --------------------------------------------------

            reason_query = f"""
                recommendation_reason(
                    {product_atom},
                    {quantity},
                    {weight_per_item},
                    {selling_price_mmk},
                    {thb_to_mmk},
                    {urgency_atom},
                    {supplier_name},
                    {shipping_name},
                    {margin},
                    Reason
                )
            """

            reason_result = prolog.query(reason_query)

            inventory_query = f"""
                reorder_needed(
                    {product_atom},
                    6,
                    Recommendation,
                    CurrentStock,
                    AverageSales
                )
            """

            inventory_result = prolog.query(inventory_query)

            return {
                "recommendation": result,
                "reasons": reason_result,
                "inventory": inventory_result,
            }


# ==========================================================
# Main program
# ==========================================================

if __name__ == "__main__":
    print("===================================")
    print("     ShopAI Import Advisor")
    print("===================================")

    product = input(
        "Product: "
    ).strip().lower()

    quantity = int(
        input("Quantity: ")
    )

    urgency = input(
        "Urgency (normal/urgent): "
    ).strip().lower()

    result = get_recommendation(
        product=product,
        quantity=quantity,
        urgency=urgency,
    )

    recommendation_result = result["recommendation"]
    reasons = result["reasons"]

    if not recommendation_result:
        print("\nNo suitable recommendation found.")

    else:
        recommendation = recommendation_result[0]
        inventory_result = result["inventory"]

        print("\n--- Inventory ---")

        if inventory_result:
            inventory_data = inventory_result[0]

            current_stock = inventory_data["CurrentStock"]
            average_sales = float(
                inventory_data["AverageSales"]
            )
            inventory_decision = inventory_data[
                "Recommendation"
            ]

            print(
                f"Current Stock: {current_stock}"
            )

            print(
                f"Average Daily Sales: "
                f"{average_sales:.2f}"
            )

            if inventory_decision == "reorder":
                print("Inventory Decision: REORDER")
            else:
                print("Inventory Decision: NO REORDER")
        else:
            print("Inventory data unavailable.")

        supplier_name = recommendation["Supplier"]
        shipping_name = recommendation["Shipping"]
        margin = float(recommendation["Margin"])
        score = float(recommendation["Score"])

        # --------------------------------------------------
        # Get additional information from MariaDB
        # --------------------------------------------------

        product_data = get_product(product)

        supplier_data = get_supplier_product(
            product_data["id"],
            supplier_name,
        )

        shipping_data = get_shipping_method(
            shipping_name
        )

        # --------------------------------------------------
        # Cost calculations
        # --------------------------------------------------

        product_cost_thb = (
            float(supplier_data["price_thb"])
            * quantity
        )

        total_weight = (
            float(product_data["weight_kg"])
            * quantity
        )

        shipping_cost_thb = (
            float(shipping_data["cost_thb_per_kg"])
            * total_weight
        )

        total_cost_thb = (
            product_cost_thb
            + shipping_cost_thb
        )

        # Temporary test exchange rate.
        exchange_rate = 100

        total_cost_mmk = (
            total_cost_thb
            * exchange_rate
        )

        revenue_mmk = (
            float(product_data["selling_price_mmk"])
            * quantity
        )

        profit_mmk = (
            revenue_mmk
            - total_cost_mmk
        )

        # --------------------------------------------------
        # Display recommendation
        # --------------------------------------------------

        print("\n===================================")
        print("       AI RECOMMENDATION")
        print("===================================")

        print(f"Supplier: {supplier_name}")
        print(f"Shipping: {shipping_name}")

        print("\n--- Cost Analysis ---")

        print(
            f"Product Cost: "
            f"{product_cost_thb:,.2f} THB"
        )

        print(
            f"Shipping Cost: "
            f"{shipping_cost_thb:,.2f} THB"
        )

        print(
            f"Total Cost: "
            f"{total_cost_thb:,.2f} THB"
        )

        print(
            f"Total Cost: "
            f"{total_cost_mmk:,.2f} MMK"
        )

        print(
            f"Expected Revenue: "
            f"{revenue_mmk:,.2f} MMK"
        )

        print(
            f"Estimated Profit: "
            f"{profit_mmk:,.2f} MMK"
        )

        print(
            f"Profit Margin: "
            f"{margin:.2f}%"
        )

        print(
            f"AI Score: "
            f"{score:.2f}"
        )

        print("\nDecision: RECOMMENDED")

        # --------------------------------------------------
        # Display reasoning
        # --------------------------------------------------

        print("\n--- Reasoning of The Engine ---")

        if reasons:
            reason_list = reasons[0]["Reason"]

            for reason in reason_list:
                print(f"- {reason}")