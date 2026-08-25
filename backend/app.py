from pathlib import Path
from swiplserver import PrologMQI


PROJECT_ROOT = Path(__file__).resolve().parent.parent
PROLOG_DIR = PROJECT_ROOT / "Prolog"
MAIN_PL = PROLOG_DIR / "main.pl"


def get_recommendation(
    product: str,
    quantity: int,
    weight_per_item: float,
    selling_price_mmk: float,
    thb_to_mmk: float,
    urgency: str,
):
    with PrologMQI() as mqi:
        with mqi.create_thread() as prolog:

            prolog.query(
                f"consult('{MAIN_PL.as_posix()}')"
            )

            product_atom = product.replace("'", "''")
            urgency_atom = urgency.replace("'", "''")

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

            return prolog.query(query)


if __name__ == "__main__":
    result = get_recommendation(
        product="handbag",
        quantity=100,
        weight_per_item=0.5,
        selling_price_mmk=40000,
        thb_to_mmk=100,
        urgency="normal",
    )

    print("Best recommendation:")
    print(result)