import Icon from "../icon/Icon";
import primaryBack from "../../svg/back-arrow-primary.svg";
import darkAccentBack from "../../svg/back-arrow-darkAccent.svg";
import "./goBack.scss";
import Header from "../header/Header";

const GoBack = ({ handleClick, variant, className, content }) => {
    const icons = {
        primary: primaryBack,
        darkAccent: darkAccentBack,
    };
    return (
        <div className={`${className} go-back-container`} onClick={handleClick}>
            <Icon src={icons[variant]} className='go-back-icon' />
            {content && (
                <Header
                    type={`fS14 fW600 ${variant}`}
                    className='go-back-label'>
                    {content}
                </Header>
            )}
        </div>
    );
};

export default GoBack;
