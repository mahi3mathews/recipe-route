from enum import Enum


class OrderStatus(Enum):
    COMPLETED = 'COMPLETED'
    ACCEPTED = 'ACCEPTED'
    REJECTED = "REJECTED"
    READY = 'READY'
    WAITING = 'WAITING'
