import "./header.scss";

const Header = ({ className, type, children, handleClick }) => {
    return (
        <div
            onClick={handleClick}
            className={`header ${className ?? ""} ${
                type ?? "text fW400 fS14"
            }`}>
            {children}
        </div>
    );
};

export default Header;
