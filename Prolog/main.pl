:- consult(supplier).
:- consult(shipping).
:- consult(profitability).
:- consult(inventory).

% ==========================================================
% Find a valid candidate
% ==========================================================

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

    supplier(
        Supplier,
        Product,
        _Price,
        MOQ,
        Rating
    ),

    Quantity >= MOQ,

    reliable_supplier(Supplier),

    suitable_shipping(
        ShippingMethod,
        Urgency
    ),

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


% ==========================================================
% Find the best candidate
% ==========================================================

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
        candidate(
            CandidateScore,
            CandidateSupplier,
            CandidateShipping,
            CandidateMargin
        ),
        candidate(
            Product,
            Quantity,
            WeightPerItem,
            SellingPriceMMK,
            THBToMMK,
            Urgency,
            CandidateSupplier,
            CandidateShipping,
            CandidateMargin,
            CandidateScore
        ),
        Candidates
    ),

    sort(
        Candidates,
        SortedCandidates
    ),

    SortedCandidates = [_|_],

    last(
        SortedCandidates,
        candidate(
            Score,
            Supplier,
            ShippingMethod,
            Margin
        )
    ).


% ==========================================================
% Explain why the recommendation was made
% ==========================================================

recommendation_reason(
    Product,
    Quantity,
    WeightPerItem,
    SellingPriceMMK,
    THBToMMK,
    Urgency,
    Supplier,
    ShippingMethod,
    Margin,
    Reason
) :-

    supplier(
        Supplier,
        Product,
        PriceTHB,
        MOQ,
        Rating
    ),

    shipping(
        ShippingMethod,
        ShippingCostPerKg,
        DeliveryDays
    ),

    TotalWeight is Quantity * WeightPerItem,
    ProductCostTHB is PriceTHB * Quantity,
    ShippingCostTHB is ShippingCostPerKg * TotalWeight,
    TotalCostTHB is ProductCostTHB + ShippingCostTHB,
    TotalCostMMK is TotalCostTHB * THBToMMK,
    RevenueMMK is SellingPriceMMK * Quantity,
    ProfitMMK is RevenueMMK - TotalCostMMK,

    (
        Rating >= 4.5 ->
        SupplierReason =
            "Supplier is considered reliable because the rating is at least 4.5."
        ;
        SupplierReason =
            "Supplier has a rating below the reliability threshold."
    ),

    (
        Quantity >= MOQ ->
        MOQReason =
            "The order quantity satisfies the supplier minimum order quantity."
        ;
        MOQReason =
            "The order quantity does not satisfy the supplier minimum order quantity."
    ),

    (
        Urgency = urgent ->
        (
            ShippingMethod = air_cargo ->
            ShippingReason =
                "Air cargo was selected because the order is urgent."
            ;
            ShippingReason =
                "The selected shipping method does not provide the fastest delivery."
        )
        ;
        ShippingMethod = land_cargo ->
        ShippingReason =
            "Land cargo was selected because the order is not urgent and has a lower shipping cost."
        ;
        ShippingReason =
            "The selected shipping method matches the current delivery requirement."
    ),

    (
        Margin >= 20 ->
        ProfitReason =
            "The expected profit margin meets the 20% minimum target."
        ;
        ProfitReason =
            "The expected profit margin is below the 20% target."
    ),

    format(
        atom(ProductReason),
        "The product cost is ~2f THB for ~0f units.",
        [ProductCostTHB, Quantity]
    ),

    format(
        atom(ShippingCostReason),
        "Shipping costs ~2f THB for ~2f kg and the estimated delivery time is ~0f days.",
        [ShippingCostTHB, TotalWeight, DeliveryDays]
    ),

    format(
        atom(ProfitDetail),
        "Estimated profit is ~2f MMK with a ~2f% margin.",
        [ProfitMMK, Margin]
    ),

    Reason = [
        ProductReason,
        SupplierReason,
        MOQReason,
        ShippingReason,
        ShippingCostReason,
        ProfitReason,
        ProfitDetail
    ].