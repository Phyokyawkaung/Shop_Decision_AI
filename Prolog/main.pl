:- consult(supplier).
:- consult(shipping).
:- consult(profitability).


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
        _Price,
        MOQ,
        Rating
    ),

    (
        Rating >= 4.5
        ->
        SupplierReason =
            "Supplier has a high reliability rating."
        ;
        SupplierReason =
            "Supplier has a lower reliability rating."
    ),

    (
        Quantity >= MOQ
        ->
        MOQReason =
            "The requested quantity satisfies the supplier MOQ."
        ;
        MOQReason =
            "The requested quantity does not satisfy the supplier MOQ."
    ),

    (
        Urgency = urgent,
        ShippingMethod = air_cargo
        ->
        ShippingReason =
            "Air cargo is suitable because the order is urgent."
        ;
        Urgency = normal,
        ShippingMethod = land_cargo
        ->
        ShippingReason =
            "Land cargo is suitable because the order is not urgent."
        ;
        ShippingReason =
            "The selected shipping method is suitable for the order."
    ),

    (
        Margin >= 20
        ->
        ProfitReason =
            "The expected profit margin meets the minimum profitability requirement."
        ;
        ProfitReason =
            "The expected profit margin does not meet the minimum profitability requirement."
    ),

    % Keep these variables explicitly part of the reasoning
    % predicate so the predicate can be expanded later.
    _ = WeightPerItem,
    _ = SellingPriceMMK,
    _ = THBToMMK,

    Reason = [
        SupplierReason,
        MOQReason,
        ShippingReason,
        ProfitReason
    ].