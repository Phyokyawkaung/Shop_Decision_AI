import csv
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
CSV_FILE = PROJECT_ROOT / "data" / "scraped_data.csv"


def load_products():
    """Load product records from the CSV file."""

    if not CSV_FILE.exists():
        raise FileNotFoundError(
            f"CSV file not found: {CSV_FILE}"
        )

    products = []

    with open(
        CSV_FILE,
        "r",
        encoding="utf-8-sig",
        newline="",
    ) as file:

        reader = csv.DictReader(file)

        for row in reader:
            products.append(row)

    return products


def search_products(
    products,
    keyword: str,
    category: str | None = None,
):
    """Search products by name/category/supplier."""

    keyword = keyword.lower().strip()

    results = []

    for product in products:

        product_name = product[
            "product_name"
        ].lower()

        supplier_name = product[
            "supplier_name"
        ].lower()

        product_category = product[
            "category"
        ].lower()

        matches_keyword = (
            keyword in product_name
            or keyword in supplier_name
            or keyword in product_category
        )

        matches_category = (
            category is None
            or product_category == category.lower()
        )

        if matches_keyword and matches_category:
            results.append(product)

    return results


def display_products(results):
    """Display search results in a readable format."""

    if not results:
        print("\nNo products found.")
        return

    print(
        f"\nFound {len(results)} product(s):\n"
    )

    for index, product in enumerate(
        results,
        start=1,
    ):
        print(
            f"[{index}] {product['product_name']}"
        )

        print(
            f"    Supplier: "
            f"{product['supplier_name']}"
        )

        print(
            f"    Category: "
            f"{product['category']}"
        )

        print(
            f"    Price: "
            f"{product['price_thb']} THB"
        )

        print(
            f"    Weight: "
            f"{product['weight_kg']} kg"
        )

        print(
            f"    MOQ: "
            f"{product['moq']}"
        )

        print(
            f"    Rating: "
            f"{product['rating']}"
        )

        print(
            f"    Trust Score: "
            f"{product['trust_score']}"
        )

        print(
            f"    URL: "
            f"{product['url']}"
        )

        print()

def main():
    products = load_products()

    print("===================================")
    print("       ShopAI Product Search")
    print("===================================")

    keyword = input(
        "Search product: "
    ).strip()

    results = search_products(
        products,
        keyword,
    )

    if not results:
        print("\nNo products found.")
        return None

    display_products(results)

    selection = input(
        "Select a product number: "
    ).strip()

    try:
        index = int(selection)
    except ValueError:
        print("Invalid selection.")
        return None

    if index < 1 or index > len(results):
        print("Invalid product number.")
        return None

    return results[index - 1]


if __name__ == "__main__":
    selected_product = main()

    if selected_product:
        print(
            f"\nSelected: "
            f"{selected_product['product_name']}"
        )