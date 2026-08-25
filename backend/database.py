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
            SELECT id, name, weight_kg, selling_price_mmk
            FROM products
            WHERE name = %s
            """,
            (product_name,),
        )

        return cursor.fetchone()

    finally:
        cursor.close()
        connection.close()


def get_suppliers(product_id: int):
    connection = get_connection()

    try:
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                s.name,
                s.rating,
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