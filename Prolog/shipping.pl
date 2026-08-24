% shipping(Method, CostTHBPerKg, DeliveryDays).

shipping(land_cargo, 50, 6).
shipping(air_cargo, 180, 2).

% Air is recommended when the order is urgent.
suitable_shipping(air_cargo, urgent).

% Land cargo is recommended when urgency is normal.
suitable_shipping(land_cargo, normal).