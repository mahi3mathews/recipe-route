import { useEffect, useState } from "react";
import Icon from "../../components/icon/Icon";
import Header from "../../components/header/Header";
import increase from "../../svg/increase-darkAccent.svg";
import decrease from "../../svg/decrease-darkAccent.svg";
import useDelayedCallback from "../../hooks/useDelayedCallback";

const StockQty = ({ qty, updateInventory }) => {
    const [stock_qty, setQty] = useState(qty);
    const [stockPrevState, setPrevState] = useState([]);

    const handleCallback = (details, isSuccess) => {
        if (!isSuccess) {
            setQty(stockPrevState[stockPrevState?.length - 1]);
            setPrevState((prevState) =>
                prevState.slice(0, prevState?.length - 1)
            );
        }
    };

    useDelayedCallback(stockPrevState, () =>
        updateInventory(stock_qty, handleCallback)
    );

    useEffect(() => {
        setQty(qty);
    }, [qty]);

    const handleQtyChange = (type) => {
        let qty_amt = type === "ADD" ? stock_qty + 1 : stock_qty - 1;
        setPrevState((prevState) => [...prevState, stock_qty]);
        setQty(qty_amt);
    };

    return (
        <div className='stock-qty'>
            <Icon
                onClick={() => handleQtyChange("ADD")}
                isCursor
                src={increase}
                className='stock-qty-icon increase'
            />
            <Header type='fS14 fW500 text'>{stock_qty}</Header>
            <Icon
                onClick={() => handleQtyChange("SUB")}
                isCursor
                src={decrease}
                className='stock-qty-icon decrease'
            />
        </div>
    );
};

export default StockQty;
