const StoreOrderContent = ({ order }) => {
    return (
        <div className='store-order-content'>
            {Object.keys(order).map((item, key) => {
                return (
                    <div key={`${key}-${order[item]?.name}`}>
                        {order[item]?.name}
                    </div>
                );
            })}
        </div>
    );
};

export default StoreOrderContent;
