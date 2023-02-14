import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { PATH } from "../../constants/API";
import { CartContext } from "../helpers/context/cart-context";
import { SearchContext } from "../helpers/context/search-context";
import { AuthContext } from "../helpers/context/auth-context";
function Header({ categories }) {
    const [userCart, setUserCart] = useState(undefined);
    const [deletingItem, setDeletingItem] = useState(-1);
    const [searchParam, setSearchParam] = useState("");
    const cartContext = useContext(CartContext);
    const authContext = useContext(AuthContext);
    const searchContext = useContext(SearchContext);
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(
        () => {
            async function getUserInfo() {
                try {
                    if (authContext.isAuthenticated) {
                        const token = 'Bearer ' + localStorage.getItem("token")
                        const response = await axios.get(PATH.API_ROOT_URL + PATH.API_ORDER + "/cart/user", {
                            headers: {
                                'Authorization': token
                            }
                        });
                        setUserCart(response.data)
                    }
                } catch (error) {
                    console.error(error.message)
                }
            }
            getUserInfo()
        }
        , [authContext.isAuthenticated, cartContext])

    useEffect(
        () => {
            async function deleteItem() {
                try {
                    if (deletingItem > -1) {
                        await axios.post(PATH.API_ROOT_URL + PATH.API_ORDER + "/cart/deleteItem", {
                            productCode: userCart.cartItemDtos[deletingItem].productDto.code,
                            productInventory: userCart.cartItemDtos[deletingItem].inventoryItem.sku,
                            units: userCart.cartItemDtos[deletingItem].units
                        }, {
                            headers: {
                                'Authorization': 'Bearer ' + localStorage.getItem("token")
                            }
                        });
                        const temp = userCart;
                        temp.cartItemDtos.splice(deletingItem, 1)
                        setUserCart(temp)
                    }
                    setDeletingItem(-1)
                } catch (error) {
                    console.error(error.message)
                }
            }
            deleteItem()
        }
        , [deletingItem, userCart])

    const getInputValue = (event) => {
        // show the user input value to console
        setSearchParam(event.target.value)
    };
    useEffect(
        () => {
            async function setSearch() {
            }
            setSearch();
        }, [searchParam]);
        
    const handleSearch = () => {
        const path = location.pathname.split("/")[1];
        (searchContext.search)(searchParam)
        if (path !== "search" && path !== "category") {
            navigate("/search", { replace: true });
        }
    }
    const handleRemoveCartItem = (index) => {
        setDeletingItem(index)
    }
    return (
        <header className="header header-10 header-intro-clearance">
            <div className="header-top">
                <div className="container">
                    <div className="header-left">
                        <a href="tel:#"><i className="icon-phone" />Hỗ trợ: +84 0334 998 977 </a>
                    </div>{/* End .header-left */}
                    <div className="header-right">
                        <ul className="top-menu">
                            <li>
                                <ul>
                                    <li className="login">
                                        {authContext.isAuthenticated ?
                                            <div>
                                                <span>
                                                    Xin chào <NavLink to={"/dashboard"}>{localStorage.getItem("lastname") + " " + localStorage.getItem("firstname")}! </NavLink>
                                                </span>
                                                <a href="#" onClick={authContext.logout}> Đăng xuất</a>
                                            </div>

                                            :
                                            <a href="#signin-modal" data-toggle="modal">Đăng nhập / Đăng ký</a>}
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                </div>{/* End .container */}
            </div>{/* End .header-top */}
            <div className="header-middle">
                <div className="container">
                    <div className="header-left">
                        <button className="mobile-menu-toggler">
                            <span className="sr-only">Toggle mobile menu</span>
                            <i className="icon-bars" />
                        </button>
                        <NavLink className="logo" to="/">
                            <img src="/assets/images/demos/demo-13/logo.png" alt="Molla Logo" width={105} height={25} />
                        </NavLink>
                    </div>{/* End .header-left */}
                    <div className="header-center">
                        <div className="header-search header-search-extended header-search-visible header-search-no-radius d-none d-lg-block">
                            <a href="#" className="search-toggle" role="button"><i className="icon-search" /></a>
                            <div className="header-search-wrapper search-wrapper-wide">
                                <label htmlFor="q" className="sr-only">Search</label>
                                <input type="search" onChange={getInputValue} className="form-control" name="q" id="q" placeholder="Tìm kiếm sản phẩm ..." required />
                                <button className="btn btn-primary" onClick={() => handleSearch()}><i className="icon-search" /></button>
                            </div>{/* End .header-search-wrapper */}
                        </div>{/* End .header-search */}
                    </div>
                    <div className="header-right">
                        {userCart &&
                            <div className="header-dropdown-link">
                                {/* <NavLink to="/wishlist" className="wishlist-link">
                                    <i className="icon-heart-o" />
                                    <span className="wishlist-count">3</span>
                                    <span className="wishlist-txt">Yêu thích</span>
                                </NavLink> */}
                                <div className="dropdown cart-dropdown">
                                    <NavLink to={"/cart"} className="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" data-display="static">
                                        <i className="icon-shopping-cart" />
                                        {userCart.cartItemDtos.length > 0 &&
                                            <span className="cart-count">{userCart.cartItemDtos.length}</span>
                                        }
                                        <span className="cart-txt">Giỏ Hàng</span>
                                    </NavLink>
                                    {userCart.cartItemDtos.length > 0 &&
                                        <div className="dropdown-menu dropdown-menu-right">
                                            <div className="dropdown-cart-products">
                                                {userCart.cartItemDtos.map((item, index) => (
                                                    <div className="product">
                                                        <div className="product-cart-details">
                                                            <h4 className="product-title">
                                                                <NavLink to={"/product/" + item.productDto.code}>{item.productDto.name}</NavLink>
                                                            </h4>
                                                            <span className="cart-product-info">
                                                                <span className="cart-product-qty">{item.units} </span>
                                                                x {item.inventoryItem.retailPrice} VND
                                                            </span>
                                                        </div>{/* End .product-cart-details */}
                                                        <figure className="product-image-container">
                                                            <NavLink to={"/product/" + item.productDto.code} className="product-image">
                                                                {item.productDto.mediaList != null && item.productDto.mediaList.length > 0 &&
                                                                    <img src={item.productDto.mediaList[0].imgUrl} alt={item.productDto.mediaList[0].altText} />}

                                                            </NavLink>
                                                        </figure>
                                                        <button onClick={() => handleRemoveCartItem(index)} className="btn-remove" title="Remove Product"><i className="icon-close" /></button>
                                                    </div>
                                                ))}
                                            </div>{/* End .cart-product */}
                                            <div className="dropdown-cart-total">
                                                <span>Tổng cộng</span>
                                                <span className="cart-total-price">{userCart.totals} VNĐ</span>
                                            </div>{/* End .dropdown-cart-total */}
                                            <div className="dropdown-cart-action">
                                                <NavLink to={"/cart"} className="btn btn-primary">Xem giỏ hàng</NavLink>
                                                <NavLink to={"/checkout"} className="btn btn-outline-primary-2"><span>Đặt hàng</span><i className="icon-long-arrow-right" /></NavLink>
                                            </div>{/* End .dropdown-cart-total */}
                                        </div>
                                    }
                                </div>{/* End .cart-dropdown */}
                            </div>}
                    </div>{/* End .header-right */}
                </div>{/* End .container */}
            </div>{/* End .header-middle */}
            <div className="header-bottom sticky-header">
                <div className="container">
                    <div className="header-left">
                        <div className="dropdown category-dropdown is-on" data-visible="true">
                            <a href="#" className="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" data-display="static" title="Browse Categories">
                                Danh sách mặt hàng
                            </a>
                            <div className="dropdown-menu ">
                                <nav className="side-nav">
                                    <ul className="menu-vertical sf-arrows">
                                        {categories.map((item, index) => (
                                            item.subCategories && item.subCategories.length > 0 ?
                                                <li key={item.code} className="megamenu-container">
                                                    <NavLink className="sf-with-ul" to={"/category/" + item.code}>{item.name}</NavLink>
                                                    <div key={item.code} className="megamenu">
                                                        <div className="row no-gutters">
                                                            <div className="col-md-8">
                                                                <div className="menu-col">
                                                                    <div className="row">
                                                                        {item.subCategories.reduce(function (rows, key, index) {
                                                                            const subCatRows = (index % 2 == 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows;
                                                                            return (subCatRows);
                                                                        }, []).map((subCatRow) => (
                                                                            <div key={subCatRow.code} className="col-md-6">
                                                                                {subCatRow.map(col => (
                                                                                    <div key={col.code}>
                                                                                        <NavLink className="menu-title" to={"/category/" + col.code}>{col.name}</NavLink>
                                                                                        {col.subCategories && col.subCategories.length > 0 ?
                                                                                            <ul>
                                                                                                {col.subCategories.map((colSubCat) => (
                                                                                                    <li key={colSubCat.code}><NavLink to={"/category/" + colSubCat.code}>{colSubCat.name}</NavLink>
                                                                                                    </li>
                                                                                                ))}
                                                                                            </ul>
                                                                                            : <div />}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ))}

                                                                    </div>{/* End .row */}
                                                                </div>{/* End .menu-col */}
                                                            </div>{/* End .col-md-8 */}
                                                            <div className="col-md-4">
                                                                <div className="banner banner-overlay">
                                                                    <a href="category.html" className="banner banner-menu">
                                                                        <img src="/assets/images/demos/demo-13/menu/banner-1.jpg" alt="Banner" />
                                                                    </a>
                                                                </div>{/* End .banner banner-overlay */}
                                                            </div>{/* End .col-md-4 */}
                                                        </div>{/* End .row */}
                                                    </div>
                                                </li>
                                                : <li key={item.code}><NavLink to={"/category/" + item.code}>{item.name}</NavLink>
                                                </li>
                                        ))}
                                    </ul>{/* End .menu-vertical */}
                                </nav>{/* End .side-nav */}
                            </div>{/* End .dropdown-menu */}
                        </div>{/* End .category-dropdown */}
                    </div>{/* End .col-lg-3 */}
                    <div className="header-right">
                        <i className="la la-lightbulb-o" /><p>Miễn Phí Vận Chuyển</p>
                    </div>
                </div>{/* End .container */}
            </div>{/* End .header-bottom */}
        </header>); {/* End .header */ }
}
export default Header;