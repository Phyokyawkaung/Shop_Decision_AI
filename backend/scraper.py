import csv
import random
import re

SUPPLIER_DATA = [
    {
        "name": "F D & A Inter Co. Ltd.",
        "trust_score": 79,
        "products": [
            "Copper Cathode", "Aluminium Scrap", "Aluminium Ingots",
            "Sunflower Oil", "Coconut Oil", "Olive Oil", "Soybean Oil",
            "Palm Oil", "Jasmin Rice", "Brown Rice", "Home Mali Rice",
            "Sugar", "Brown Sugar", "Red Kidney Beans", "Black Beans",
            "Shrimp", "Tilapia Fish", "Crabs", "Wires & Cables",
            "Organic Essential Oils",
        ],
    },
    {
        "name": "Suwancham Dairy Ltd",
        "trust_score": 79,
        "products": [
            "Lucozade Energy Drink Orange", "Natural Power Energy Drink",
            "Sweetened Condensed Milk", "Kidney Beans", "Sunflower Oil",
            "Pimple and Whitening Soap", "White and Yellow Corn",
            "Refind White dust and Crystal Sugar", "A4 Copy Paper",
            "Best Quality Peanuts", "Barley", "Beans",
            "Original 100g Antiseptic Dettol Soap",
            "X3 OHO Glutathione Collagen Soap",
            "Fruity Pineapple and Papaya Natural Soap", "100% Pure Thailand Milk",
        ],
    },
    {
        "name": "Planet Silver Wholesale Jewelry",
        "trust_score": 78,
        "products": [
            "Sterling Silver Rings", "Sterling Silver Necklaces",
            "Sterling Silver Bracelets", "Sterling Silver Earrings",
            "Silver Pendants", "Silver Charms",
            "Gemstone Jewelry", "Fashion Jewelry",
            "Wholesale Silver Jewelry", "Silver Sets",
        ],
    },
    {
        "name": "Finixx Group",
        "trust_score": 81,
        "products": [
            "Truck Tyres TBR", "OTR Tyres", "Industrial Tyres",
            "Agricultural Tyres", "Forklift Tyres",
            "Rubber Products", "Auto Parts",
            "Industrial Equipment", "Construction Materials",
        ],
    },
    {
        "name": "Aureus Thai Group",
        "trust_score": 78,
        "products": [
            "Paras Gold Rice", "PR-11 Rice", "Thai Jasmine Rice",
            "Basmati Rice", "Sticky Rice", "Rice Products",
            "Thai Food Products", "Frozen Foods", "Snacks",
            "Beverages", "Seasonings",
        ],
    },
    {
        "name": "Supannee Trading Limited Partership",
        "trust_score": 78,
        "products": [
            "Walnuts", "Chicken Feet", "Red Tilapia",
            "Seafood Products", "Frozen Foods", "Canned Foods",
            "Thai Snacks", "Condiments", "Spices",
            "Nuts and Seeds", "Dried Foods",
        ],
    },
    {
        "name": "Thiladee Sinlawan",
        "trust_score": 78,
        "products": [
            "Dried Grass Jelly Leaves", "Dried Reetha (Soapnut)",
            "Herbal Products", "Natural Products",
            "Organic Products", "Traditional Thai Products",
        ],
    },
    {
        "name": "Big Star Co. Ltd.",
        "trust_score": 79,
        "products": [
            "Drumsticks", "Leggings", "Trouser",
            "T-Shirts", "Shirts", "Jeans",
            "Jackets", "Sportswear", "Workwear",
            "Fashion Apparel", "Textiles",
        ],
    },
    {
        "name": "C.P. Intertrade Co., Ltd.",
        "trust_score": 70,
        "products": [
            "Food Products", "Beverages", "Consumer Goods",
            "Household Items", "Personal Care Products",
            "Grocery Items", "Packaged Foods",
        ],
    },
    {
        "name": "MV Siam Limited",
        "trust_score": 81,
        "products": [
            "Vermi compost", "OCC waste paper",
            "Recycled paper", "Waste paper",
            "Paper Products", "Packaging Materials",
            "Recycling Materials", "Eco Products",
        ],
    },
    {
        "name": "Okura World Transport Co., Ltd.",
        "trust_score": 77,
        "products": [
            "Dog Food", "Canned Items", "Pepsi Cans",
            "Beverages", "Snack Foods", "Pet Food",
            "Imported Foods", "Japanese Products",
            "Transportation Services",
        ],
    },
    {
        "name": "Khumsub Asia Goods Trading Co., Ltd.",
        "trust_score": 81,
        "products": [
            "Thai Curry Red Green Yellow", "Ethanol 96% Food Grade",
            "Ethanol 99% Sugarcane", "Ethanol Rice",
            "Chemical Products", "Food Additives",
            "Industrial Chemicals", "Organic Chemicals",
            "Raw Materials",
        ],
    },
    {
        "name": "Mangmee Enterprise Company Limited",
        "trust_score": 79,
        "products": [
            "MCC PH102", "USB Polygraph Machine",
            "Alpha-Olefin Sulfonate AOS 92%",
            "Chemical Products", "Industrial Supplies",
            "Laboratory Equipment", "Testing Equipment",
            "Safety Equipment",
        ],
    },
    {
        "name": "Thai Peace Pulp (Thailand) Co., Ltd",
        "trust_score": 78,
        "products": [
            "Freon R-417A Refrigerant Gas", "Continental Coach HA3 Tire",
            "Pampers Baby-Dry Diapers", "Paper Pulp",
            "Tissue Paper", "Paper Products",
            "Hygiene Products", "Personal Care",
        ],
    },
    {
        "name": "Ashirwad Trading Co. Ltd.",
        "trust_score": 77,
        "products": [
            "MARATHON SUPER G", "CGG 75mm", "CGG 50mm",
            "Industrial Products", "Construction Materials",
            "Building Supplies", "Hardware",
            "Tools and Equipment",
        ],
    },
]

FOOD_KEYWORDS = [
    "milk", "dairy", "cheese", "butter", "yogurt",
    "rice", "sugar", "oil", "fish", "shrimp", "crab",
    "meat", "chicken", "pork", "beef", "seafood",
    "fruit", "vegetable", "bean", "corn", "wheat",
    "flour", "bread", "noodle", "pasta", "sauce",
    "spice", "herb", "salt", "pepper", "honey",
    "juice", "water", "coffee", "tea", "drink",
    "snack", "candy", "chocolate", "biscuit", "cake",
    "food", "eat", "cook", "bakery", "frozen",
    "peanut", "barley", "soybean", "palm", "olive",
    "kidney", "tilapia", "condensed", "curry",
    "walnut", "seafood", "nuts", "seeds",
]

METAL_KEYWORDS = [
    "steel", "iron", "copper", "aluminum", "aluminium",
    "zinc", "lead", "tin", "nickel", "chrome",
    "metal", "alloy", "scrap", "ingot", "cathode",
    "wire", "cable", "pipe", "tube", "sheet",
    "plate", "bar", "rod", "coil", "strip",
]

BEVERAGE_KEYWORDS = [
    "drink", "beverage", "juice", "beer",
    "wine", "spirit", "energy", "soda", "soft drink",
    "tea", "coffee", "concentrate", "lucozade",
    "pepsi", "ethanol",
]

SOAP_KEYWORDS = [
    "soap", "detergent", "clean", "wash", "shampoo",
    "hygiene", "personal care", "diaper",
]

CLOTHING_KEYWORDS = [
    "shirt", "jean", "jacket", "pant", "trouser",
    "legging", "dress", "skirt", "wear", "fashion",
    "textile", "fabric", "apparel",
]

TYRE_KEYWORDS = [
    "tyre", "tire", "wheel", "rubber",
]

PAPER_KEYWORDS = [
    "paper", "pulp", "tissue", "cardboard",
]

CHEMICAL_KEYWORDS = [
    "chemical", "ethanol", "sulfonate", "freon",
    "refrigerant", "mcc",
]


def categorize_product(product_name: str) -> str:
    name_lower = product_name.lower()

    for keyword in TYRE_KEYWORDS:
        if keyword in name_lower:
            return "consumer"

    for keyword in CLOTHING_KEYWORDS:
        if keyword in name_lower:
            return "consumer"

    for keyword in SOAP_KEYWORDS:
        if keyword in name_lower:
            return "consumer"

    for keyword in PAPER_KEYWORDS:
        if keyword in name_lower:
            return "consumer"

    for keyword in CHEMICAL_KEYWORDS:
        if keyword in name_lower:
            return "metal"

    for keyword in BEVERAGE_KEYWORDS:
        if keyword in name_lower:
            return "beverage"

    for keyword in FOOD_KEYWORDS:
        if keyword in name_lower:
            return "food"

    for keyword in METAL_KEYWORDS:
        if keyword in name_lower:
            return "metal"

    return "consumer"


def estimate_price(category: str) -> float:
    ranges = {
        "food": (50, 200),
        "beverage": (30, 100),
        "metal": (100, 500),
        "consumer": (20, 100),
    }
    low, high = ranges.get(category, (50, 150))
    return round(random.uniform(low, high), 2)


def estimate_weight(category: str) -> float:
    ranges = {
        "food": (0.5, 2.0),
        "beverage": (0.3, 1.0),
        "metal": (5.0, 20.0),
        "consumer": (0.1, 1.0),
    }
    low, high = ranges.get(category, (0.5, 2.0))
    return round(random.uniform(low, high), 2)


def main():
    print("=" * 50)
    print("  Generating Supplier Data CSV")
    print("=" * 50)

    all_rows = []

    for supplier in SUPPLIER_DATA:
        name = supplier["name"]
        trust_score = supplier["trust_score"]
        rating = round(trust_score / 20, 2)

        print(f"\n  {name}")
        print(f"    Trust Score: {trust_score}/100 (Rating: {rating})")
        print(f"    Products: {len(supplier['products'])}")

        for product_name in supplier["products"]:
            category = categorize_product(product_name)
            all_rows.append({
                "supplier_name": name,
                "trust_score": trust_score,
                "rating": rating,
                "product_name": product_name,
                "category": category,
                "price_thb": estimate_price(category),
                "weight_kg": estimate_weight(category),
                "moq": 1,
                "url": f"https://eximnext.com/supplier/{name.lower().replace(' ', '-').replace('.', '').replace(',', '')}",
            })

    fieldnames = [
        "supplier_name",
        "trust_score",
        "rating",
        "product_name",
        "category",
        "price_thb",
        "weight_kg",
        "moq",
        "url",
    ]

    with open("scraped_data.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_rows)

    print("\n" + "=" * 50)
    print(f"  DONE: {len(SUPPLIER_DATA)} suppliers, {len(all_rows)} products")
    print(f"  Saved to: scraped_data.csv")
    print("=" * 50)


if __name__ == "__main__":
    main()
