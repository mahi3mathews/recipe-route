import Header from "../../components/header/Header";

const AddStoreInventory = ({ uploadComponent }) => {
    return (
        <div className='store-inventory'>
            <div className='store-inventory-instructions'>
                <Header type='fS14 fW500'>
                    Please follow the guidelines below to prepare your CSV file
                    for item data upload. Ensure that the CSV file is structured
                    as follows:
                </Header>
                <ol>
                    <li>
                        <b>Header Row:</b> The first row should contain the
                        column names for each attribute. Make sure to use the
                        exact column names mentioned below.
                    </li>
                    <li>
                        <b>Attribute Columns:</b>
                        <ul>
                            <li>Item Name: Enter the name of each item.</li>
                            <li>
                                Quantity Measurement: Specify the quantity
                                measurement for each item (e.g., 1kg, 500g,
                                2lb).
                            </li>
                            <li>
                                Stock quantity: Provide the stock quantity
                                available for each item.
                            </li>
                            <li>
                                Stock Price: Enter the price of a single item.
                            </li>
                            <li>
                                Item Type: Add the category under which the item
                                falls.
                            </li>
                            <li>
                                Supplier: Provide the supplier if required or
                                leave " - "
                            </li>
                        </ul>
                    </li>
                    <li>
                        <b>Data Example:</b> Here's an example of how your CSV
                        file should look:
                        <div className='store-inventory-example'>
                            <Header
                                type='fS14 fW600 primary'
                                className='row-header'>
                                <div className='row-cell'>Item Name</div>
                                <div className='row-cell'>
                                    Quantity Measurement
                                </div>
                                <div className='row-cell'>Stock Quantity</div>
                                <div className='row-cell'>Price</div>
                                <div className='row-cell'>Item Type</div>
                                <div className='row-cell'>Supplier</div>
                            </Header>
                            <Header
                                className='row-header'
                                type='fS12 fW600 primary'>
                                <div className='row-cell'>Apple</div>
                                <div className='row-cell'>1kg</div>
                                <div className='row-cell'>10</div>
                                <div className='row-cell'>1.99</div>
                                <div className='row-cell'>FRUIT</div>
                                <div className='row-cell'>Supplier ABC</div>
                            </Header>
                            <Header
                                className='row-header'
                                type='fS12 fW600 primary'>
                                <div className='row-cell'>Banana</div>
                                <div className='row-cell'>500g</div>
                                <div className='row-cell'>15</div>
                                <div className='row-cell'>0.99</div>
                                <div className='row-cell'>FRUIT</div>
                                <div className='row-cell'>Supplier ABC</div>
                            </Header>
                            <Header
                                className='row-header'
                                type='fS12 fW600 primary'>
                                <div className='row-cell'>Onion</div>
                                <div className='row-cell'>2lb</div>
                                <div className='row-cell'>8</div>
                                <div className='row-cell'>2.49</div>
                                <div className='row-cell'>VEGETABLE</div>
                                <div className='row-cell'>Supplier ABC</div>
                            </Header>
                        </div>
                    </li>
                </ol>
            </div>
            <div>{uploadComponent}</div>
        </div>
    );
};

export default AddStoreInventory;
