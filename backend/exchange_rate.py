import requests


API_URL = "https://open.er-api.com/v6/latest/THB"


def get_thb_to_mmk_rate():
    response = requests.get(
        API_URL,
        timeout=10,
    )

    response.raise_for_status()

    data = response.json()

    if data.get("result") != "success":
        raise RuntimeError(
            "Exchange-rate API request failed."
        )

    rates = data.get("rates", {})

    if "MMK" not in rates:
        raise RuntimeError(
            "THB → MMK rate is unavailable."
        )

    return {
        "rate": float(rates["MMK"]),
        "retrieved_at": data.get("time_last_update_utc"),
        "source": "ExchangeRate-API",
    }


if __name__ == "__main__":
    result = get_thb_to_mmk_rate()

    print("THB → MMK Exchange Rate")
    print("-----------------------")
    print(f"Rate: {result['rate']}")
    print(f"Updated: {result['retrieved_at']}")
    print(f"Source: {result['source']}")