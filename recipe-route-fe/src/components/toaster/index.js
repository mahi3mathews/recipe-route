import { Toast, ToastContainer } from "react-bootstrap";
import warningIcon from "../../svg/warning.svg";
import errorIcon from "../../svg/error.svg";
import Icon from "../icon/Icon";
import Header from "../header/Header";
import "./toaster.scss";

const Toaster = ({
    handleClose,
    show,
    delay,
    className,
    variant,
    content,
    position = "top-center",
}) => {
    const toasterIcon = {
        warning: warningIcon,
        error: errorIcon,
    };
    return (
        <ToastContainer
            position={position}
            style={{ zIndex: 1 }}
            className={`custom-toaster-container ${className}`}>
            <Toast
                className='custom-toaster'
                onClose={handleClose}
                show={show}
                delay={delay ?? 3000}
                autohide>
                <Icon
                    icon={toasterIcon[variant]}
                    className='custom-toaster-icon'
                />
                <Header
                    type={`${variant} fS14 fW600`}
                    className='custom-toaster-header'>
                    {content}
                </Header>
            </Toast>
        </ToastContainer>
    );
};

export default Toaster;
