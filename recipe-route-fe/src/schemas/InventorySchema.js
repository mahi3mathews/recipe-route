import * as Yup from "yup";
import { INGREDIENT_TYPES } from "../constants/ingredients_list";

export const InventorySchema = Yup.object().shape({
    item_name: Yup.string().required("Required"),
    stock_qty: Yup.number().min(1).required("Required"),
    item_type: Yup.string()
        .oneOf(INGREDIENT_TYPES, "Invalid type")
        .required("Required"),
    qty_measurement: Yup.string().required("Required"),
    unit_price: Yup.number().min(0.01).required("Required"),
    stock_supplier: Yup.string().required("Required"),
});
