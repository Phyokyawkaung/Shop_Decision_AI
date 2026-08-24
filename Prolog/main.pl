:- consult(supplier).
:- consult(shipping).
:- consult(profitability).

recommend(Product, Quantity, WeightPerItem,
           SellingPriceMMK, THBToMMK, Urgency,
           Supplier, ShippingMethod, Margin) :-

    supplier(Supplier, Product, _, MOQ, _Rating),
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
    ).