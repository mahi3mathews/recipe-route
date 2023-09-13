from enum import Enum


class PaymentStatus(Enum):
    PAID = "PAID"
    NOT_PAID = "NOT_PAID"
    CANCELLED = "CANCELLED"
    IN_STORE_PAY = 'IN_STORE_PAY'
    PENDING = 'PENDING'
