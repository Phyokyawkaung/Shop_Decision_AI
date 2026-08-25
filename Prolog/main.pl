:- consult(supplier).
:- consult(shipping).
:- consult(profitability).


candidate(
    Product,
    Quantity,
    WeightPerItem,
    SellingPriceMMK,
    THBToMMK,
    Urgency,
    Supplier,
    ShippingMethod,
    Margin,
    Score
) :-

    supplier(Supplier, Product, _, MOQ, Rating),
    Quantity >= MOQ,

    reliable_supplier(Supplier),

    suitable_shipping(ShippingMethod, Urgency),

    profitable(
        Supplier,
        Quantity,
        ShippingMethod,
        WeightPerItem,
        SellingPriceMMK,
        THBToMMK,
        Margin
    ),

    Score is (Margin * 1.5) + (Rating * 15).


best_recommendation(
    Product,
    Quantity,
    WeightPerItem,
    SellingPriceMMK,
    THBToMMK,
    Urgency,
    Supplier,
    ShippingMethod,
    Margin,
    Score
) :-

    findall(
        candidate(ScoreX, SupplierX, ShippingX, MarginX),
        candidate(
            Product,
            Quantity,
            WeightPerItem,
            SellingPriceMMK,
            THBToMMK,
            Urgency,
            SupplierX,
            ShippingX,
            MarginX,
            ScoreX
        ),
        Candidates
    ),

    sort(Candidates, Sorted),

    last(
        Sorted,
        candidate(Score, Supplier, ShippingMethod, Margin)
    ).