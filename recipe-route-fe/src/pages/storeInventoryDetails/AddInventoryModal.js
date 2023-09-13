import Modal from "../../components/modal/Modal";
import { Formik, useFormik } from "formik";
import { Form } from "react-bootstrap";
import Input from "../../components/input/Input";
import Dropdown from "../../components/dropdown/Dropdown";
import {
    INGREDIENT_TYPES,
    ingredientTypes,
} from "../../constants/ingredients_list";
import { InventorySchema } from "../../schemas/InventorySchema";
import { useEffect, useState } from "react";
import { addInventoryItemAsync } from "../../api/store/stores";

const AddInventoryModal = ({ showModal, handleClose, handleSuccess }) => {
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [typeTitle, setTypeTitle] = useState("");
    const itemTypeMenu = INGREDIENT_TYPES?.map((item) => ({
        title: ingredientTypes[item],
        data: { value: item },
    }));

    const handleAddInventoryItem = async (values) => {
        setLoading(true);

        let res = await addInventoryItemAsync(values);
        if (res?.status?.includes?.("success")) {
            await handleSuccess();
            setLoading(false);
            handleClose();
        } else {
            setLoading(false);
            setError(res?.message ?? "");
        }
    };
    const initialValues = {
        item_name: "",
        stock_qty: "",
        item_type: "",
        qty_measurement: "",
        unit_price: "",
        stock_supplier: "",
    };
    const formik = useFormik({
        initialValues,
        onSubmit: handleAddInventoryItem,
        validationSchema: InventorySchema,
    });

    useEffect(() => {
        if (!showModal) {
            formik.setValues(initialValues);
            setError("");
            setLoading(false);
        }
    }, [showModal]);

    const { errors, touched } = formik;
    return (
        <Modal
            className='add-inventory-modal'
            footerBtn='Add product'
            submitError={error}
            title='Add product'
            onSubmit={formik.handleSubmit}
            submitBtn={{ type: "submit", isLoading }}
            show={showModal}
            onHide={handleClose}>
            <Formik>
                <form onSubmit={formik.handleSubmit}>
                    <Form.Group>
                        <Input
                            variant='darkAccent'
                            name='item_name'
                            id='inventory-name-add'
                            type='text'
                            value={formik.values.item_name}
                            placeholder='Name of product'
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={
                                errors?.item_name && touched?.item_name
                                    ? errors?.item_name
                                    : ""
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Input
                            variant='darkAccent'
                            name='stock_qty'
                            id='inventory-stock_qty-add'
                            type='text-number'
                            isStrictNumber
                            value={formik.values.stock_qty}
                            placeholder='Stock quantity'
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={
                                errors?.stock_qty && touched?.stock_qty
                                    ? errors?.stock_qty
                                    : ""
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Input
                            variant='darkAccent'
                            name='qty_measurement'
                            id='inventory-qty_measurement-add'
                            type='text'
                            value={formik.values.qty_measurement}
                            placeholder='Quantity and measurement of product'
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={
                                errors?.qty_measurement &&
                                touched?.qty_measurement
                                    ? errors?.qty_measurement
                                    : ""
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Input
                            variant='darkAccent'
                            name='unit_price'
                            id='inventory-unit_price-add'
                            type='text-number'
                            value={formik.values.unit_price}
                            placeholder='Unit price of product'
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={
                                errors?.unit_price && touched?.unit_price
                                    ? errors?.unit_price
                                    : ""
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Input
                            variant='darkAccent'
                            name='stock_supplier'
                            id='inventory-stock_supplier-add'
                            type='text'
                            value={formik.values.stock_supplier}
                            placeholder='Supplier of product'
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={
                                errors?.stock_supplier &&
                                touched?.stock_supplier
                                    ? errors?.stock_supplier
                                    : ""
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Dropdown
                            className='add-inventory-modal-dropdown'
                            menu={itemTypeMenu}
                            variant='darkAccent'
                            showChev
                            error={
                                errors?.item_type && touched?.item_type
                                    ? errors?.item_type
                                    : ""
                            }
                            value={
                                !typeTitle ? "Category of product" : typeTitle
                            }
                            handleChange={(data) => {
                                setTypeTitle(ingredientTypes[data?.value]);
                                formik.setFieldValue("item_type", data?.value);
                            }}
                        />
                    </Form.Group>
                </form>
            </Formik>
        </Modal>
    );
};

export default AddInventoryModal;
