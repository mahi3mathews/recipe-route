import Icon from "../icon/Icon";
import like from "../../svg/like-primary.svg";
import liked from "../../svg/filled-like-primary.svg";

const Favorite = ({ isFavorite, handleClick, className }) => {
    return (
        <div className={`fav-component ${className}`}>
            <Icon
                src={isFavorite ? liked : like}
                onClick={handleClick}
                isCursor
                className='fav-icon'
            />
        </div>
    );
};

export default Favorite;
