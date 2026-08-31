:- dynamic supplier/6.

% supplier(
%     Name,
%     Product,
%     PriceTHB,
%     MOQ,
%     Rating,
%     TrustScore
% ).

% A supplier must meet both minimum standards.
reliable_supplier(Name) :-
    supplier(
        Name,
        _,
        _,
        _,
        Rating,
        TrustScore
    ),
    Rating >= 3.8,
    TrustScore >= 75.