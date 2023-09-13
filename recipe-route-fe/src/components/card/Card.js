import { Card as ReactCard } from "react-bootstrap";
import "./card.scss";

// Custom Card component with common style for entire application
const Card = ({
    children,
    index,
    variant,
    className,
    onClick = () => {},
    disabled,
    isCursor,
}) => {
    return (
        <ReactCard
            key={`${index}-${className}`}
            onClick={disabled ? () => {} : onClick}
            className={`${className ?? ""} custom-card ${
                !disabled ? variant ?? "" : "disabled"
            } ${isCursor && !disabled ? "cursor" : ""}`}>
            {children}
        </ReactCard>
    );
};

export default Card;
