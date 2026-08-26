from dataclasses import dataclass
from typing import Optional


@dataclass
class ProductRecord:
    product: str
    supplier: str
    price_thb: float
    moq: int
    supplier_rating: Optional[float]
    weight_kg: Optional[float]
    selling_price_mmk: Optional[float]


class ProductSource:
    """
    Base interface for any product data source.

    A scraper, API client, or CSV importer can implement
    this interface and return ProductRecord objects.
    """

    def fetch_products(self) -> list[ProductRecord]:
        raise NotImplementedError