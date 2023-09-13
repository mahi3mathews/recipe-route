import Header from "../header/Header";
import "./checkbox.scss";
import { useState, useEffect } from "react";

const Checkbox = ({
    label,
    variant = "primary",
    disabled,
    checked,
    handleSelect,
    headerVariant,
    className = "",
}) => {
    const [isChecked, setIsChecked] = useState(checked ?? false);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const handleChange = () => {
        setIsChecked((prevState) => !prevState);
        handleSelect(!isChecked);
    };

    return (
        <div className={`checkbox ${variant} ${className}`}>
            <label>
                <input
                    type='checkbox'
                    className={isChecked ? "checked" : ""}
                    checked={checked}
                    disabled={disabled}
                    onChange={handleChange}
                />
                {label && (
                    <Header type={headerVariant ?? `fS16 fW400 text`}>
                        {label}
                    </Header>
                )}
            </label>
        </div>
    );
};

export default Checkbox;
