% supplier(Name, Product, PriceTHB, MOQ, Rating).

supplier(supplier_a, handbag, 220, 20, 4.7).
supplier(supplier_b, handbag, 200, 100, 4.1).
supplier(supplier_c, handbag, 240, 10, 4.9).

% A supplier is considered reliable if rating >= 4.5.
reliable_supplier(Name) :-
    supplier(Name, _, _, _, Rating),
    Rating >= 4.5.