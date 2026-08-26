import csv
from pathlib import Path

from database import get_connection


PROJECT_ROOT = Path(__file__).resolve().parent.parent
CSV_FILE = PROJECT_ROOT / "data" / "products_import.csv"


def get_or_create_product(
    cursor,
    name: str,
    selling_price_mmk: float,
    weight_kg: float,
):
    cursor.execute(
        """
        SELECT id
        FROM products
        WHERE name = %s
        """,
        (name,),
    )

    result = cursor.fetchone()

    if result:
        product_id = result[0]

        cursor.execute(
            """
            UPDATE products
            SET selling_price_mmk = %s,
                weight_kg = %s
            WHERE id = %s
            """,
            (
                selling_price_mmk,
                weight_kg,
                product_id,
            ),
        )

        return product_id

    cursor.execute(
        """
        INSERT INTO products (
            name,
            weight_kg,
            selling_price_mmk
        )
        VALUES (%s, %s, %s)
        """,
        (
            name,
            weight_kg,
            selling_price_mmk,
        ),
    )

    return cursor.lastrowid


def get_or_create_supplier(
    cursor,
    name: str,
    rating: float,
):
    cursor.execute(
        """
        SELECT id
        FROM suppliers
        WHERE name = %s
        """,
        (name,),
    )

    result = cursor.fetchone()

    if result:
        supplier_id = result[0]

        cursor.execute(
            """
            UPDATE suppliers
            SET rating = %s,
                reliable = %s
            WHERE id = %s
            """,
            (
                rating,
                rating >= 4.5,
                supplier_id,
            ),
        )

        return supplier_id

    cursor.execute(
        """
        INSERT INTO suppliers (
            name,
            rating,
            reliable
        )
        VALUES (%s, %s, %s)
        """,
        (
            name,
            rating,
            rating >= 4.5,
        ),
    )

    return cursor.lastrowid


def import_products():
    connection = get_connection()

    try:
        cursor = connection.cursor()

        with open(
            CSV_FILE,
            "r",
            encoding="utf-8",
            newline="",
        ) as file:

            reader = csv.DictReader(file)

            for row in reader:

                product_name = row["product"]
                supplier_name = row["supplier"]

                selling_price = float(
                    row["selling_price_mmk"]
                )

                weight = float(
                    row["weight_kg"]
                )

                rating = float(
                    row["supplier_rating"]
                )

                price_thb = float(
                    row["price_thb"]
                )

                moq = int(
                    row["moq"]
                )

                product_id = get_or_create_product(
                    cursor,
                    product_name,
                    selling_price,
                    weight,
                )

                supplier_id = get_or_create_supplier(
                    cursor,
                    supplier_name,
                    rating,
                )

                cursor.execute(
                    """
                    SELECT id
                    FROM supplier_products
                    WHERE supplier_id = %s
                      AND product_id = %s
                    """,
                    (
                        supplier_id,
                        product_id,
                    ),
                )

                existing = cursor.fetchone()

                if existing:
                    cursor.execute(
                        """
                        UPDATE supplier_products
                        SET price_thb = %s,
                            moq = %s
                        WHERE id = %s
                        """,
                        (
                            price_thb,
                            moq,
                            existing[0],
                        ),
                    )
                else:
                    cursor.execute(
                        """
                        INSERT INTO supplier_products (
                            supplier_id,
                            product_id,
                            price_thb,
                            moq
                        )
                        VALUES (%s, %s, %s, %s)
                        """,
                        (
                            supplier_id,
                            product_id,
                            price_thb,
                            moq,
                        ),
                    )

        connection.commit()

        print("CSV import completed successfully.")

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()
        connection.close()


if __name__ == "__main__":
    import_products()