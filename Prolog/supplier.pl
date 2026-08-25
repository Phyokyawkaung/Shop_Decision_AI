:- dynamic supplier/5.

reliable_supplier(Name) :-
    supplier(Name, _, _, _, Rating),
    Rating >= 4.5.