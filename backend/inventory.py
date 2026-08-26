from database import get_inventory, get_recent_sales


def calculate_inventory_status(
    product_id: int,
    product_name: str,
    lead_time_days: int,
):
    inventory = get_inventory(product_id)

    if inventory is None:
        return None

    current_stock = int(inventory["current_stock"])
    safety_stock = int(inventory["safety_stock"])

    sales = get_recent_sales(product_id)

    if not sales:
        average_daily_sales = 0
    else:
        total_sales = sum(
            int(sale["quantity_sold"])
            for sale in sales
        )

        average_daily_sales = (
            total_sales / len(sales)
        )

    reorder_point = (
        average_daily_sales * lead_time_days
    ) + safety_stock

    should_reorder = (
        current_stock <= reorder_point
    )

    return {
        "product": product_name,
        "current_stock": current_stock,
        "safety_stock": safety_stock,
        "average_daily_sales": average_daily_sales,
        "reorder_point": reorder_point,
        "should_reorder": should_reorder,
    }