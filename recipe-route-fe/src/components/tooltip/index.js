import { useState } from "react";
import "./tooltip.scss";

const Tooltip = ({
    className,
    content,
    direction,
    variant,
    delay,
    children,
}) => {
    let timeout;
    const [active, setActive] = useState(false);

    const showTip = () => {
        timeout = setTimeout(() => {
            setActive(true);
        }, delay || 400);
    };

    const hideTip = () => {
        clearInterval(timeout);
        setActive(false);
    };
    return (
        <div
            className={`custom-tooltip ${className}`}
            onMouseEnter={showTip}
            onMouseLeave={hideTip}>
            {children}
            {active && (
                <div
                    className={`custom-tooltip-tip ${variant ?? "darkAccent"} ${
                        direction ?? "right"
                    }`}>
                    {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
