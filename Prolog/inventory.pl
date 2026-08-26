:- dynamic inventory_data/3.
:- dynamic sales_data/2.

average_daily_sales(Product, Average) :-
    findall(
        Quantity,
        sales_data(Product, Quantity),
        Sales
    ),
    Sales \= [],
    sum_list(Sales, TotalSales),
    length(Sales, NumberOfDays),
    Average is TotalSales / NumberOfDays.

reorder_needed(
    Product,
    LeadTimeDays,
    Recommendation,
    CurrentStock,
    AverageSales
) :-
    inventory_data(
        Product,
        CurrentStock,
        SafetyStock
    ),

    average_daily_sales(
        Product,
        AverageSales
    ),

    ReorderPoint is
        (AverageSales * LeadTimeDays)
        + SafetyStock,

    (
        CurrentStock =< ReorderPoint
        ->
        Recommendation = reorder
        ;
        Recommendation = no_reorder
    ).