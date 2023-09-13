export const user_order_status = {
    WAITING: (type) => {
        if (type === "PICKUP") return "Waiting for store to accept...";
        else return "";
    },
    ACCEPTED: () => {
        return "Waiting for store to pack...";
    },
    COMPLETED: () => {
        return "Completed";
    },
    READY: (type) => {
        if (type === "PICKUP") return "Ready for pick up";
    },
};

export const order_types = {
    PICKUP: "Pick up",
    DELIVERY: "Delivery",
};

export const store_order_status = {
    ACCEPTED: "Accepted",
    WAITING: "Waiting",
    COMPLETED: "Completed",
    READY: "Ready",
};
