import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { USER_HOME_URL, STORE_HOME_URL } from "../../constants/route_urls";
import "./navbar.scss";
import { navLinks } from "../../constants/user_nav_links";
import { useSelector } from "react-redux";
import Header from "../header/Header";
import Icon from "../icon/Icon";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import primaryLogo from "../../svg/logo-color.svg";
import useScreenSize from "../../hooks/useScreenSize";
import menu from "../../svg/menu-icon.svg";
import { useState, useEffect } from "react";
import Dropdown from "../dropdown/Dropdown";
import { STORE } from "../../constants/user_roles";

const NavBar = ({ additionalRender }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userRole, userImg] = useSelector((states) => [
        states?.user?.userDetails?.role,
        states?.user?.userDetails?.img,
    ]);
    const APP_NAME = "Recipe Route";
    const { width } = useScreenSize();
    const [showMenu, setShowMenu] = useState(false);
    const [navTitle, setNavTitle] = useState(APP_NAME);
    const [isShowNoLink, setShowNoLink] = useState(false);

    const handleMenuClick = () => {
        setShowMenu((prevState) => !prevState);
    };
    const homeUrlGetter = () =>
        userRole === STORE ? STORE_HOME_URL : USER_HOME_URL;

    useEffect(() => {
        const navHiddenLinks = navLinks.filter(
            (item) => item?.isNavHidden && location.pathname === item?.link
        );
        if (navHiddenLinks?.length === 1) {
            setShowNoLink(true);
            setNavTitle(navHiddenLinks[0].title);
        } else if (isShowNoLink) {
            setShowNoLink(false);
            setNavTitle(APP_NAME);
        }
    }, [location]);

    return (
        <div className='navbar-container'>
            <Navbar className='navbar'>
                <div className='navbar-content-wrapper'>
                    <Navbar.Brand onClick={() => navigate(homeUrlGetter())}>
                        <Icon src={primaryLogo} className='navbar-logo' />
                        <Header
                            type={`${
                                width > 900
                                    ? "fS24"
                                    : width > 350
                                    ? "fS21"
                                    : "fS18"
                            } fW600 primary`}>
                            {navTitle}
                        </Header>
                    </Navbar.Brand>
                    {!isShowNoLink && (
                        <>
                            {width <= 900 && (
                                <div className='navbar-menu-bar'>
                                    <Icon
                                        src={menu}
                                        className='navbar-menu-icon'
                                        onClick={handleMenuClick}
                                    />
                                </div>
                            )}
                            {width > 900 && (
                                <NavContent
                                    userRole={userRole}
                                    userImg={userImg}
                                    additionalRender={additionalRender}
                                />
                            )}
                        </>
                    )}
                </div>
                {width <= 900 && showMenu && (
                    <div className='navbar-navlink-wrapper'>
                        <NavContent
                            userRole={userRole}
                            className='navbar-navlink-mob'
                            isResponsiveMenu
                            additionalRender={additionalRender}
                        />
                    </div>
                )}
            </Navbar>
        </div>
    );
};

const NavContent = ({
    userRole,
    className,
    isResponsiveMenu,
    additionalRender,
    userImg,
}) => {
    const navigate = useNavigate();
    return (
        <Nav className={`${className}`}>
            {navLinks.map((item, key) => {
                return item?.roles?.includes(String(userRole)) &&
                    !item?.isNotDisplay ? (
                    item?.dropdown &&
                    item?.dropdown?.length > 0 &&
                    !isResponsiveMenu ? (
                        <Dropdown
                            keyValue={`${key}-navbar-nav`}
                            variant='transparent'
                            menu={item?.dropdown}
                            value={
                                <Icon
                                    rounded
                                    icon={userImg ?? item?.icon}
                                    className='navbar-navlink-icon'
                                />
                            }
                            handleChange={(data) => {
                                navigate(data?.url);
                            }}
                        />
                    ) : (
                        ((item?.isResponsiveLink && isResponsiveMenu) ||
                            (!item?.isResponsiveLink && !isResponsiveMenu) ||
                            item?.isAlwaysRender) && (
                            <NavLink
                                key={`${key}-navbar-nav`}
                                to={item?.link}
                                className={`navbar-navlink ${item?.position}`}>
                                {item?.customComponent &&
                                    additionalRender?.[item?.customComponent]}
                                <Header
                                    className='navbar-navlink-title'
                                    type='primary fS16 fW600'>
                                    {item?.title}
                                    {item?.additionalCustom &&
                                        additionalRender?.[
                                            item?.additionalCustom
                                        ]}
                                </Header>
                            </NavLink>
                        )
                    )
                ) : null;
            })}
        </Nav>
    );
};

export default NavBar;
