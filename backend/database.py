import mysql.connector


def get_connection():
    return mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="",
        database="shop_ai",
    )


def get_product(product_name: str):
    connection = get_connection()

    try:
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                id,
                name,
                category,
                weight_kg,
                selling_price_mmk
            FROM products
            WHERE LOWER(name) = LOWER(%s)
            """,
            (product_name,),
        )

        return cursor.fetchone()

    finally:
        cursor.close()
        connection.close()


def get_product_by_id(product_id: int):
    connection = get_connection()

    try:
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                id,
                name,
                category,
                weight_kg,
                selling_price_mmk
            FROM products
            WHERE id = %s
            """,
            (product_id,),
        )

        return cursor.fetchone()

    finally:
        cursor.close()
        connection.close()


def search_product_records(query: str = ""):
    connection = get_connection()

    try:
        cursor = connection.cursor(dictionary=True)

        query = query.strip().lower()

        if query:
            keyword = f"%{query}%"

            cursor.execute(
                """
                SELECT
                    p.id,
                    p.name AS product_name,
                    s.name AS supplier_name,
                    p.category,
                    sp.price_thb,
                    p.weight_kg,
                    sp.moq,
                    s.rating,
                    s.trust_score,
                    sp.source_url AS url
                FROM products p
                JOIN supplier_products sp
                    ON sp.product_id = p.id
                JOIN suppliers s
                    ON s.id = sp.supplier_id
                WHERE
                    LOWER(p.name) LIKE %s
                    OR LOWER(s.name) LIKE %s
                    OR LOWER(COALESCE(p.category, '')) LIKE %s
                ORDER BY p.name
                """,
                (keyword, keyword, keyword),
            )
        else:
            cursor.execute(
                """
                SELECT
                    p.id,
                    p.name AS product_name,
                    s.name AS supplier_name,
                    p.category,
                    sp.price_thb,
                    p.weight_kg,
                    sp.moq,
                    s.rating,
                    s.trust_score,
                    sp.source_url AS url
                FROM products p
                JOIN supplier_products sp
                    ON sp.product_id = p.id
                JOIN suppliers s
                    ON s.id = sp.supplier_id
                ORDER BY p.name
                """
            )

        return cursor.fetchall()

    finally:
        cursor.close()
        connection.close()


def get_all_product_records():
    return search_product_records("")


def get_suppliers(product_id: int):
    connection = get_connection()

    try:
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                s.name,
                s.rating,
                s.trust_score,
                s.reliable,
                sp.price_thb,
                sp.moq
            FROM supplier_products sp
            JOIN suppliers s
                ON s.id = sp.supplier_id
            WHERE sp.product_id = %s
            """,
            (product_id,),
        )

        return cursor.fetchall()

    finally:
        cursor.close()
        connection.close()


def get_shipping_methods():
    connection = get_connection()

    try:
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                name,
                cost_thb_per_kg,
                delivery_days
            FROM shipping_methods
            """
        )

        return cursor.fetchall()

    finally:
        cursor.close()
        connection.close()


def get_supplier_product(product_id: int, supplier_name: str):
    connection = get_connection()

    try:
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                s.name,
                s.rating,
                s.trust_score,
                sp.price_thb,
                sp.moq
            FROM supplier_products sp
            JOIN suppliers s
                ON s.id = sp.supplier_id
            WHERE sp.product_id = %s
              AND s.name = %s
            """,
            (product_id, supplier_name),
        )

        return cursor.fetchone()

    finally:
        cursor.close()
        connection.close()


def get_shipping_method(method_name: str):
    connection = get_connection()

    try:
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                name,
                cost_thb_per_kg,
                delivery_days
            FROM shipping_methods
            WHERE name = %s
            """,
            (method_name,),
        )

        return cursor.fetchone()

    finally:
        cursor.close()
        connection.close()


def get_inventory(product_id: int):
    connection = get_connection()

    try:
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                current_stock,
                safety_stock
            FROM inventory
            WHERE product_id = %s
            """,
            (product_id,),
        )

        return cursor.fetchone()

    finally:
        cursor.close()
        connection.close()


def get_recent_sales(product_id: int):
    connection = get_connection()

    try:
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                quantity_sold,
                sale_date
            FROM sales
            WHERE product_id = %s
            ORDER BY sale_date DESC
            """,
            (product_id,),
        )

        return cursor.fetchall()

    finally:
        cursor.close()
        connection.close()


def get_inventory_overview():
    connection = get_connection()

    try:
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                i.product_id AS id,
                p.name AS product_name,
                i.current_stock,
                i.safety_stock
            FROM inventory i
            JOIN products p
                ON p.id = i.product_id
            ORDER BY p.name
            """
        )

        rows = cursor.fetchall()

        for row in rows:
            cursor.execute(
                """
                SELECT AVG(quantity_sold) AS average_daily_sales
                FROM sales
                WHERE product_id = %s
                """,
                (row["id"],),
            )

            sales = cursor.fetchone()

            average_sales = (
                float(sales["average_daily_sales"])
                if sales
                and sales["average_daily_sales"] is not None
                else 0.0
            )

            reorder_point = (
                average_sales * 6
                + float(row["safety_stock"])
            )

            row["average_daily_sales"] = average_sales
            row["reorder_point"] = reorder_point

            row["status"] = (
                "REORDER"
                if float(row["current_stock"]) <= reorder_point
                else "OK"
            )

        return rows

    finally:
        cursor.close()
        connection.close()


def get_dashboard_stats():
    connection = get_connection()

    try:
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            "SELECT COUNT(*) AS total FROM products"
        )
        products = cursor.fetchone()["total"]

        cursor.execute(
            "SELECT COUNT(*) AS total FROM suppliers"
        )
        suppliers = cursor.fetchone()["total"]

        return {
            "products": products,
            "suppliers": suppliers,
            "analyses": get_analysis_count(),
        }

    finally:
        cursor.close()
        connection.close()
def save_analysis(
    product_id: int,
    supplier: str,
    shipping: str,
    quantity: int,
    selling_price_mmk: float,
    profit_margin: float,
    ai_score: float,
    decision: str,
):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO analysis_history (
                product_id,
                supplier,
                shipping,
                quantity,
                selling_price_mmk,
                profit_margin,
                ai_score,
                decision
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                product_id,
                supplier,
                shipping,
                quantity,
                selling_price_mmk,
                profit_margin,
                ai_score,
                decision,
            ),
        )

        connection.commit()

        return cursor.lastrowid

    finally:
        cursor.close()
        connection.close()

def get_analysis_history(limit=10):
    connection = get_connection()

    try:
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                ah.id,
                DATE_FORMAT(
                    ah.created_at,
                    '%Y-%m-%d'
                ) AS date,
                ah.product_id,
                p.name AS product_name,
                ah.supplier,
                ah.shipping,
                ah.quantity,
                ah.selling_price_mmk,
                ah.profit_margin,
                ah.ai_score,
                ah.decision
            FROM analysis_history ah
            JOIN products p
                ON p.id = ah.product_id
            ORDER BY ah.created_at DESC
            LIMIT %s
            """,
            (limit,),
        )

        return cursor.fetchall()

    finally:
        cursor.close()
        connection.close()


def get_analysis_count():
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT COUNT(*) AS total
            FROM analysis_history
            """
        )

        return cursor.fetchone()[0]

    finally:
        cursor.close()
        connection.close()