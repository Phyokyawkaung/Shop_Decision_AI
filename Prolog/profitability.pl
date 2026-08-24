% Calculate total product cost in THB.
product_cost(Supplier, Quantity, Cost) :-
    supplier(Supplier, _, Price, MOQ, _),
    Quantity >= MOQ,
    Cost is Price * Quantity.

% Calculate shipping cost.
shipping_cost(Method, Quantity, WeightPerItem, Cost) :-
    shipping(Method, PricePerKg, _),
    TotalWeight is Quantity * WeightPerItem,
    Cost is PricePerKg * TotalWeight.

% A product is profitable when estimated margin >= 20%.
profitable(Supplier, Quantity, Method, WeightPerItem,
           SellingPriceMMK, THBToMMK, Margin) :-

    product_cost(Supplier, Quantity, ProductCostTHB),
    shipping_cost(Method, Quantity, WeightPerItem, ShippingCostTHB),

    TotalCostTHB is ProductCostTHB + ShippingCostTHB,
    TotalCostMMK is TotalCostTHB * THBToMMK,

    RevenueMMK is SellingPriceMMK * Quantity,

    ProfitMMK is RevenueMMK - TotalCostMMK,
    Margin is (ProfitMMK / RevenueMMK) * 100,

    Margin >= 20.