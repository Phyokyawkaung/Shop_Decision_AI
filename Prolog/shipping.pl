:- dynamic shipping/3.

% shipping(Method, CostPerKg, DeliveryDays).

% Both methods are possible for a normal order.
suitable_shipping(land_cargo, normal).
suitable_shipping(air_cargo, normal).

% For urgent orders, air cargo is preferred,
% but land cargo can still be considered.
suitable_shipping(air_cargo, urgent).
suitable_shipping(land_cargo, urgent).


% Shipping preference score.
%
% Urgent:
% Faster delivery gets a stronger bonus.
shipping_preference(Method, urgent, Score) :-
    shipping(Method, _, DeliveryDays),
    Score is 20 - (DeliveryDays * 2).

% Normal:
% Delivery speed matters less.
shipping_preference(Method, normal, Score) :-
    shipping(Method, _, DeliveryDays),
    Score is 10 - DeliveryDays.