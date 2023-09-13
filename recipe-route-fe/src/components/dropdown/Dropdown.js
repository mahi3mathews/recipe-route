import { Dropdown as ReactDropdown, Form } from "react-bootstrap";
import Header from "../header/Header";
import "./dropdown.scss";
import { useEffect, useRef, useState } from "react";
import Icon from "../icon/Icon";
import chevLightAccent from "../../svg/chev-down-lightAccent.svg";
import chevDarkAccent from "../../svg/chev-down-darkAccent.svg";
import chevPrimary from "../../svg/chev-down-darkAccent.svg";

// Custom dropdown component with common style for entire application
const Dropdown = ({
    className = "",
    handleChange,
    value,
    menu = [],
    error,
    variant,
    type,
    checkedList = {},
    disabled = false,
    filler,
    showChev,
    keyValue = "dropdown-container#1",
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [title, setTitle] = useState(value);

    const variantChevron = {
        primary: chevPrimary,
        lightAccent: chevLightAccent,
        darkAccent: chevDarkAccent,
        transparent: chevDarkAccent,
    };

    const wrapperRef = useRef(null);

    const handleOutsideClick = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setShowMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        setTitle(value);
    }, [value]);

    const handleItemClick = (item) => {
        handleChange(item.data);
        if (item?.title) setTitle(item.title);
        setShowMenu(false);
    };

    const menuItem = (item) => {
        switch (type) {
            case "checkbox":
                return (
                    <Form.Check
                        label={item?.title}
                        id={item?.title}
                        checked={
                            checkedList[
                                item?.key ??
                                    item?.data?.value ??
                                    item?.data?.key ??
                                    item?.title
                            ]
                        }
                    />
                );
            default:
                return (
                    <Header type='fW600 fS16 secondary'>{item?.title}</Header>
                );
        }
    };
    return (
        <div className='custom-dropdown-container' key={keyValue}>
            <ReactDropdown
                ref={wrapperRef}
                className={`custom-dropdown ${className}`}>
                <ReactDropdown.Toggle
                    id='dropdown-autoclose-true'
                    className={`custom-dropdown-toggle ${
                        error ? "error" : variant ? variant : ""
                    } ${filler ? `${filler}-filler` : ""} ${
                        disabled ? "disabled" : ""
                    }`}
                    variant='transparent'
                    onClick={() => {
                        setShowMenu((prevState) => !prevState);
                    }}>
                    <Header
                        className='custom-dropdown-toggle-text'
                        type={`fS16 fW400 caps ${
                            error ? "error" : variant ? variant : "tertiary"
                        }`}>
                        {title}
                    </Header>
                    {showChev && (
                        <Icon
                            src={variantChevron[variant]}
                            className='custom-dropdown-toggle-chevron'
                        />
                    )}
                </ReactDropdown.Toggle>
                <div className='menu-container'>
                    <div className={`menu ${showMenu ? "show" : "hide"}`}>
                        {menu.map((item, index) => (
                            <div
                                className='menu-item'
                                key={`${index}-drop-item-${keyValue}`}
                                onClick={() => handleItemClick(item)}>
                                <Header type='fS12 fW500 text caps'>
                                    {menuItem(item)}
                                </Header>
                            </div>
                        ))}
                    </div>
                </div>
            </ReactDropdown>
            {error && (
                <div className='custom-dropdown-error'>
                    <Header
                        type='error fW700 fS17'
                        className='custom-dropdown-error-content'>
                        {error}
                    </Header>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
