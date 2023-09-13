import Header from "../header/Header";
import Icon from "../icon/Icon";
import chevDark from "../../svg/chev-down-darkAccent.svg";
import { useEffect, useState } from "react";
import "./accordion.scss";
import Card from "../card/Card";

const Accordion = ({
    labels,
    content,
    className,
    showDrop,
    variant = "darkAccent",
}) => {
    const [showAccordionList, setShowAccordionList] = useState([]);
    const chevs = {
        darkAccent: chevDark,
    };
    useEffect(() => {
        if (showAccordionList?.length <= 0)
            setShowAccordionList(Object.keys(labels).map(() => false));
    }, [labels]);
    const handleTitleClick = (key) =>
        setShowAccordionList((prevState) => {
            let newState = [...prevState];
            newState[key] = !prevState[key];
            return newState;
        });
    return (
        <div className={`accordion ${className}`}>
            <div className='accordion-list-container'>
                {Object.keys(labels).map((item, key) => {
                    return (
                        <div
                            className='accordion-container'
                            key={`${key}-accordion-item`}>
                            <Header
                                handleClick={() => handleTitleClick(key)}
                                type={`fS18 fW500 ${variant}`}
                                className='accordion-title'>
                                {labels[item]}
                                {showDrop && (
                                    <Icon
                                        src={chevs[variant]}
                                        className={`accordion-title-icon ${
                                            showAccordionList[key]
                                                ? "open"
                                                : "closed"
                                        }`}
                                    />
                                )}
                            </Header>
                            {showAccordionList[key] && (
                                <Card className='accordion-content'>
                                    {content(item)}
                                </Card>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Accordion;
