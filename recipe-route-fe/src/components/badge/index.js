import Header from "../header/Header";
import "./badge.scss";

const Badge = ({ variant, className, children, fontType }) => {
    return (
        <div className={`${className} custom-badge ${variant}`}>
            <Header type={fontType ?? "fS12 fW600 lightShade"}>
                {children}{" "}
            </Header>
        </div>
    );
};

export default Badge;
