import Image from "react-bootstrap/Image";
import "./icon.scss";

const Icon = ({ src, icon, className, onClick, isCursor, rounded = false }) => {
    if (icon)
        return (
            <Image
                src={icon}
                onClick={onClick}
                className={`img ${className}`}
                roundedCircle={rounded}
            />
        );
    return (
        <img
            src={src}
            className={`icon ${className} ${isCursor ? "cursor" : ""}`}
            onClick={onClick ?? (() => {})}
        />
    );
};

export default Icon;
