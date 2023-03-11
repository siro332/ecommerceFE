/* eslint-disable jsx-a11y/anchor-is-valid */
import { React, useState, useEffect, useContext } from "react"
import axios from 'axios';
import { NavLink, useParams } from "react-router-dom";
import { PATH } from "../../constants/API"
import Header from "../common/header";
import CategoryProduct from "../home/components/categoryProduct";
import { SearchContext } from "../helpers/context/search-context";
import LoginForm from "../common/login-form";
function Category() {
    const categoryCode = useParams();
    const searchContext = useContext(SearchContext);
    const [page, setPage] = useState(1);
    const [pageNumbers, setPageNumbers] = useState([]);
    const [sortBy, setSortBy] = useState("created_at");
    const [order, setOrder] = useState("DESC");
    const [priceRange,setPriceRange] = useState([0,9999999999]);
    const [category, setCategory] = useState(undefined);
    const [categoryLoading, setCategoryLoading] = useState(true);
    const [productPage, setProductPage] = useState(undefined);
    const [productPageLoading, setProductPageLoading] = useState(true);

    const handleSortByChange = (e) => {
        const field = e.target.value.split(" ")
        console.log(field)
        setSortBy(field[0]);
        setOrder(field[1]);
    }
    const handlePriceRangeChange = (e) => {
        const field = e.target.id.split("-")
        setPriceRange(field);
    }
    const handleNextChange = () => {
        setPage(page + 1)
    }
    const handlePrevChange = () => {
        setPage(page - 1)
    }
    const handleClickPage = (item) => {
        setPage(item)
    }
    useEffect(
        () => {
            async function fetchData() {
                // You can await here
                setCategoryLoading(true);
                try {
                    const response = await axios.get(PATH.API_ROOT_URL + PATH.API_CATALOG + "/categories/category/" + categoryCode.id);
                    setCategory(response.data);
                } catch (error) {
                    console.error(error.message);
                }
                setCategoryLoading(false);
            }
            fetchData();
        }, [categoryCode.id]);
    useEffect(
        () => {
            async function fetchData() {
                // You can await here
                setProductPageLoading(true);
                try {
                    const response = await axios.get(PATH.API_ROOT_URL + PATH.API_CATALOG + "/products/search", 
                    {
                        params: {
                            page: page - 1,
                            size: 8,
                            sortParam: sortBy,
                            sortDirectionStr: order,
                            productName: searchContext.searchParam,
                            categoryCode: categoryCode.id,
                            lowestPrice: priceRange[0],
                            highestPrice: priceRange[1]
                        }
                    });
                    setProductPage(response.data);
                    const pageNumber = [];
                    const numPages = Math.ceil(response.data.totalPages / 1);
                    for (let i = 1; i <= numPages; i++) {
                        if (i <= 5 || //the first five pages
                            i === numPages || //the last page
                            Math.abs(page - i) <= 1 //the current page and the one before and after
                        )
                            pageNumber.push(i);
                    }
                    setPageNumbers(pageNumber)
                } catch (error) {
                    console.error(error.message);
                }
                setProductPageLoading(false);
            }
            fetchData();
        }, [categoryCode.id, order, page, sortBy, searchContext, priceRange]);
    useEffect(
        () => {
            async function fetchData() {
                // You can await here
                setProductPageLoading(true);
                try {
                    setPage(1)
                } catch (error) {
                    console.error(error.message);
                }
                setProductPageLoading(false);
            }
            fetchData();
        }, [order, sortBy]);

    return (
        productPage != null && category != null && <div>
            <div className="page-wrapper">
                <main className="main">
                    <nav aria-label="breadcrumb" className="breadcrumb-nav mb-3">
                        <div className="container">
                            <ol className="breadcrumb">
                            <li className="breadcrumb-item"><NavLink to="/">
                                    Trang chủ
                                </NavLink></li>
                                <li className="breadcrumb-item active" aria-current="page">{category != null ? category.name : ""}</li>
                            </ol>
                        </div>{/* End .container */}
                    </nav>{/* End .breadcrumb-nav */}
                    <div className="page-content">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-9 col-xl-4-5col">
                                    <div className="cat-blocks-container">
                                        <div className="row">
                                            {category != null && category.subCategories != null ? category.subCategories.map((item) => (
                                                <div className="col-6 col-md-4 col-lg-3">
                                                    <NavLink to={"/category/" + item.code} className="cat-block">
                                                        <figure>
                                                            <span>
                                                                {item.mediaList != null && item.mediaList.length > 0 &&
                                                                    <img src={item.mediaList.length >0? item.mediaList[0].imgUrl : ""} alt={item.mediaList[0].altText} />}
                                                            </span>
                                                        </figure>
                                                        <h3 className="cat-block-title">{item.name}</h3>
                                                    </NavLink>
                                                </div>
                                            )) : <div></div>}
                                        </div>{/* End .row */}
                                    </div>{/* End .cat-blocks-container */}
                                    <div className="mb-2" />{/* End .mb-2 */}
                                    <div className="mb-4" />{/* End .mb-4 */}
                                    <div className="toolbox">
                                        <div className="toolbox-left">
                                            <div className="toolbox-info">
                                                {productPage != null ? "Tổng cộng " + productPage.totalItems + " mặt hàng" : ""}
                                            </div>{/* End .toolbox-info */}
                                        </div>{/* End .toolbox-left */}
                                        <div className="toolbox-right">
                                            <div className="toolbox-sort">
                                                <label htmlFor="sortby">Sắp xếp:</label>
                                                <div className="select-custom">
                                                    <select name="sortby" id="sortby" defaultValue={"created_at DESC"} onChange={handleSortByChange} className="form-control">
                                                        <option value="created_at DESC">Mới nhất</option>
                                                        <option value="created_at ASC">Cũ nhất</option>
                                                        <option value="totalUnitSold DESC">Bán chạy</option>
                                                        <option value="price ASC">Giá tăng dần</option>
                                                        <option value="price DESC">Giá giảm dần</option>
                                                    </select>
                                                </div>
                                            </div>{/* End .toolbox-sort */}
                                        </div>{/* End .toolbox-right */}
                                    </div>{/* End .toolbox */}
                                    <div className="products mb-3">
                                        <div className="row">

                                            {productPage.products.map((item) => (
                                                <div className="col-6 col-md-4 col-xl-3">
                                                    <div className="product">
                                                        <figure className="product-media">
                                                            <NavLink to={"/product/" + item.code}> <img src={item.mediaList.length >0? item.mediaList[0].imgUrl : ""} alt="Product" className="product-image" />
                                                            </NavLink>
                                                            <div className="product-action-vertical">
                                                                <a href="#" className="btn-product-icon btn-wishlist btn-expandable"><span>add to wishlist</span></a>
                                                                <a href="#" className="btn-product-icon btn-compare" title="Compare"><span>Compare</span></a>
                                                                <a href="popup/quickView.html" className="btn-product-icon btn-quickview" title="Quick view"><span>Quick view</span></a>
                                                            </div>{/* End .product-action-vertical */}
                                                            <div className="product-action">
                                                            <NavLink className="btn-product btn-cart" title="Add to cart" to={"/product/" + item.code}>
                                    <span>Thêm vào giỏ</span>
                                        </NavLink>
                                                            </div>{/* End .product-action */}
                                                        </figure>{/* End .product-media */}
                                                        <div className="product-body">
                                                            <div className="product-cat">
                                                                <NavLink to={"/category/" + categoryCode.id}>
                                                                    {category.name}
                                                                </NavLink>
                                                            </div>{/* End .product-cat */}
                                                            <h3 className="product-title">
                                                                <NavLink to={"/product/" + item.code}>
                                                                    {item.name}
                                                                </NavLink></h3>{/* End .product-title */}
                                                            <div className="product-price">
                                                                {item.price + " VND"}
                                                            </div>{/* End .product-price */}
                                                            <div className="ratings-container">
                                                                <div className="ratings">
                                                                    <div className="ratings-val" style={{ width: '50%' }} />{/* End .ratings-val */}
                                                                </div>{/* End .ratings */}
                                                                <span className="ratings-text">( {item.sales} đã bán )</span>
                                                            </div>{/* End .rating-container */}
                                                        </div>{/* End .product-body */}
                                                    </div>
                                                </div>
                                            ))}


                                        </div>{/* End .row */}
                                    </div>{/* End .products */}
                                    <nav aria-label="Page navigation">
                                        <ul className="pagination">
                                            <li className={`page-item${page === 1 ? " disabled" : ""}`}>
                                                <button disabled={page === 1 ? true : false} aria-disabled={page === 1 ? true : false} className="page-link page-link-prev" onClick={() => handlePrevChange()} aria-label="Previous">
                                                    <span aria-hidden="true"><i className="icon-long-arrow-left" /></span>Trang trước
                                                </button>
                                            </li>
                                            {/* {productPage != null ? productPage. } */}
                                            {pageNumbers.map((item) => (
                                                <li className={`page-item${item === page ? " active" : ""}`} aria-current="page"><button className="page-link" onClick={() => handleClickPage(item)}>{item}</button></li>
                                            ))}
                                            <li className="page-item-total">trên {productPage.totalPages}</li>
                                            <li className={`page-item${page === productPage.totalPages ? " disabled" : ""}`}>
                                                <button disabled={page === productPage.totalPages ? true : false} aria-disabled={page === productPage.totalPages ? true : false} className="page-link page-link-next" onClick={() => handleNextChange()} aria-label="Next">
                                                    Trang tiếp <span aria-hidden="true"><i className="icon-long-arrow-right" /></span>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>{/* End .col-lg-9 */}
                                <aside className="col-lg-3 col-xl-5col order-lg-first">
                                    <div className="sidebar sidebar-shop">
                                        <div className="widget widget-categories">
                                            <h3 className="widget-title">{category != null ? category.name : ""}</h3>{/* End .widget-title */}
                                            <div className="widget-body">
                                                <div className="accordion" id="widget-cat-acc">
                                                    {category != null && category.subCategories != null ?
                                                        category.subCategories.map((item) => (
                                                            <div className="acc-item">
                                                                {item.subCategories && item.subCategories.length > 0 ?
                                                                    <a className="collapsed" role="button" data-toggle="collapse" href={"#" + item.code} aria-expanded="false" aria-controls={item.code}>
                                                                        {item.name}
                                                                    </a> :
                                                                    <NavLink to={"/category/" + item.code}>
                                                                        {item.name}
                                                                    </NavLink>}
                                                                {item.subCategories && item.subCategories.length > 0 ?
                                                                    <div id={item.code} className="collapse show" data-parent="#widget-cat-acc">
                                                                        <div className="collapse-wrap">
                                                                            <ul>
                                                                                {item.subCategories.map((subCatRow) => (
                                                                                    <li><NavLink to={"/category/" + subCatRow.code}>{subCatRow.name}</NavLink></li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    </div> : <div></div>}
                                                            </div>
                                                        )) : <div></div>
                                                    }
                                                </div>{/* End .accordion */}
                                            </div>{/* End .widget-body */}
                                        </div>{/* End .widget */}
                                        <div className="widget">
                                            <h3 className="widget-title">Khoảng giá</h3>{/* End .widget-title */}
                                            <div className="widget-body">
                                                <div className="filter-items">
                                                    <div className="filter-item">
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" className="custom-control-input" id="0-1000000" name="filter-price" onChange={handlePriceRangeChange}/>
                                                            <label className="custom-control-label" htmlFor="0-1000000">Dưới 1 triệu</label>
                                                        </div>{/* End .custom-checkbox */}
                                                    </div>{/* End .filter-item */}
                                                    <div className="filter-item">
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" className="custom-control-input" id="1000000-5000000" name="filter-price" onChange={handlePriceRangeChange}/>
                                                            <label className="custom-control-label" htmlFor="1000000-5000000">Từ 1 đến 5 triệu</label>
                                                        </div>{/* End .custom-checkbox */}
                                                    </div>{/* End .filter-item */}
                                                    <div className="filter-item">
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" className="custom-control-input" id="5000000-10000000" name="filter-price" onChange={handlePriceRangeChange}/>
                                                            <label className="custom-control-label" htmlFor="5000000-10000000">Từ 5 đến 10 triệu</label>
                                                        </div>{/* End .custom-checkbox */}
                                                    </div>{/* End .filter-item */}
                                                    <div className="filter-item">
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" className="custom-control-input" id="10000000-9999999999" name="filter-price" onChange={handlePriceRangeChange}/>
                                                            <label className="custom-control-label" htmlFor="10000000-9999999999">Trên 10 triệu</label>
                                                        </div>{/* End .custom-checkbox */}
                                                    </div>{/* End .filter-item */}
                                                </div>{/* End .filter-items */}
                                            </div>{/* End .widget-body */}
                                        </div>{/* End .widget */}
                                        <div className="widget">
                                            <h3 className="widget-title">Customer Rating</h3>{/* End .widget-title */}
                                            <div className="widget-body">
                                                <div className="filter-items">
                                                    <div className="filter-item">
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="cus-rating-1" />
                                                            <label className="custom-control-label" htmlFor="cus-rating-1">
                                                                <span className="ratings-container">
                                                                    <span className="ratings">
                                                                        <span className="ratings-val" style={{ width: '100%' }} />{/* End .ratings-val */}
                                                                    </span>{/* End .ratings */}
                                                                    <span className="ratings-text">( 24 )</span>
                                                                </span>{/* End .rating-container */}
                                                            </label>
                                                        </div>{/* End .custom-checkbox */}
                                                    </div>{/* End .filter-item */}
                                                    <div className="filter-item">
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="cus-rating-2" />
                                                            <label className="custom-control-label" htmlFor="cus-rating-2">
                                                                <span className="ratings-container">
                                                                    <span className="ratings">
                                                                        <span className="ratings-val" style={{ width: '80%' }} />{/* End .ratings-val */}
                                                                    </span>{/* End .ratings */}
                                                                    <span className="ratings-text">( 8 )</span>
                                                                </span>{/* End .rating-container */}
                                                            </label>
                                                        </div>{/* End .custom-checkbox */}
                                                    </div>{/* End .filter-item */}
                                                    <div className="filter-item">
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="cus-rating-3" />
                                                            <label className="custom-control-label" htmlFor="cus-rating-3">
                                                                <span className="ratings-container">
                                                                    <span className="ratings">
                                                                        <span className="ratings-val" style={{ width: '60%' }} />{/* End .ratings-val */}
                                                                    </span>{/* End .ratings */}
                                                                    <span className="ratings-text">( 5 )</span>
                                                                </span>{/* End .rating-container */}
                                                            </label>
                                                        </div>{/* End .custom-checkbox */}
                                                    </div>{/* End .filter-item */}
                                                    <div className="filter-item">
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="cus-rating-4" />
                                                            <label className="custom-control-label" htmlFor="cus-rating-4">
                                                                <span className="ratings-container">
                                                                    <span className="ratings">
                                                                        <span className="ratings-val" style={{ width: '40%' }} />{/* End .ratings-val */}
                                                                    </span>{/* End .ratings */}
                                                                    <span className="ratings-text">( 1 )</span>
                                                                </span>{/* End .rating-container */}
                                                            </label>
                                                        </div>{/* End .custom-checkbox */}
                                                    </div>{/* End .filter-item */}
                                                    <div className="filter-item">
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="cus-rating-5" />
                                                            <label className="custom-control-label" htmlFor="cus-rating-5">
                                                                <span className="ratings-container">
                                                                    <span className="ratings">
                                                                        <span className="ratings-val" style={{ width: '20%' }} />{/* End .ratings-val */}
                                                                    </span>{/* End .ratings */}
                                                                    <span className="ratings-text">( 3 )</span>
                                                                </span>{/* End .rating-container */}
                                                            </label>
                                                        </div>{/* End .custom-checkbox */}
                                                    </div>{/* End .filter-item */}
                                                </div>{/* End .filter-items */}
                                            </div>{/* End .widget-body */}
                                        </div>{/* End .widget */}
                                        <div className="widget widget-banner-sidebar">
                                            <div className="banner-sidebar-title">ad banner 218 x 430px</div>{/* End .ad-title */}
                                            <div className="banner-sidebar banner-overlay">
                                                <a href="#">
                                                    <img src="/assets/images/demos/demo-13/banners/banner-6.jpg" alt="banner" />
                                                </a>
                                            </div>{/* End .banner-ad */}
                                        </div>{/* End .widget */}
                                    </div>{/* End .sidebar sidebar-shop */}
                                </aside>{/* End .col-lg-3 */}
                            </div>{/* End .row */}
                        </div>{/* End .container */}
                    </div>{/* End .page-content */}
                    <div className="cta cta-horizontal cta-horizontal-box bg-primary">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-5">
                                    <h3 className="cta-title text-white">Join Our Newsletter</h3>{/* End .cta-title */}
                                    <p className="cta-desc text-white">Subcribe to get information about products and coupons</p>{/* End .cta-desc */}
                                </div>{/* End .col-lg-5 */}
                                <div className="col-lg-7">
                                    <form action="#">
                                        <div className="input-group">
                                            <input type="email" className="form-control form-control-white" placeholder="Enter your Email Address" aria-label="Email Adress" required />
                                            <div className="input-group-append">
                                                <button className="btn btn-outline-white-2" type="submit"><span>Subscribe</span><i className="icon-long-arrow-right" /></button>
                                            </div>{/* .End .input-group-append */}
                                        </div>{/* .End .input-group */}
                                    </form>
                                </div>{/* End .col-lg-7 */}
                            </div>{/* End .row */}
                        </div>{/* End .container */}
                    </div>{/* End .cta */}
                </main>{/* End .main */}

            </div>
            <button id="scroll-top" title="Back to Top"><i className="icon-arrow-up" /></button>
            {/* Mobile Menu */}
            <div className="mobile-menu-overlay" />{/* End .mobil-menu-overlay */}
            <div className="mobile-menu-container mobile-menu-light">
                <div className="mobile-menu-wrapper">
                    <span className="mobile-menu-close"><i className="icon-close" /></span>
                    <form action="#" method="get" className="mobile-search">
                        <label htmlFor="mobile-search" className="sr-only">Search</label>
                        <input type="search" className="form-control" name="mobile-search" id="mobile-search" placeholder="Search in..." required />
                        <button className="btn btn-primary" type="submit"><i className="icon-search" /></button>
                    </form>
                    <ul className="nav nav-pills-mobile nav-border-anim" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" id="mobile-menu-link" data-toggle="tab" href="#mobile-menu-tab" role="tab" aria-controls="mobile-menu-tab" aria-selected="true">Menu</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="mobile-cats-link" data-toggle="tab" href="#mobile-cats-tab" role="tab" aria-controls="mobile-cats-tab" aria-selected="false">Categories</a>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="mobile-menu-tab" role="tabpanel" aria-labelledby="mobile-menu-link">
                            <nav className="mobile-nav">
                                <ul className="mobile-menu">
                                    <li className="active">
                                        <a href="index.html">Home</a>
                                        <ul>
                                            <li><a href="index-1.html">01 - furniture store</a></li>
                                            <li><a href="index-2.html">02 - furniture store</a></li>
                                            <li><a href="index-3.html">03 - electronic store</a></li>
                                            <li><a href="index-4.html">04 - electronic store</a></li>
                                            <li><a href="index-5.html">05 - fashion store</a></li>
                                            <li><a href="index-6.html">06 - fashion store</a></li>
                                            <li><a href="index-7.html">07 - fashion store</a></li>
                                            <li><a href="index-8.html">08 - fashion store</a></li>
                                            <li><a href="index-9.html">09 - fashion store</a></li>
                                            <li><a href="index-10.html">10 - shoes store</a></li>
                                            <li><a href="index-11.html">11 - furniture simple store</a></li>
                                            <li><a href="index-12.html">12 - fashion simple store</a></li>
                                            <li><a href="index-13.html">13 - market</a></li>
                                            <li><a href="index-14.html">14 - market fullwidth</a></li>
                                            <li><a href="index-15.html">15 - lookbook 1</a></li>
                                            <li><a href="index-16.html">16 - lookbook 2</a></li>
                                            <li><a href="index-17.html">17 - fashion store</a></li>
                                            <li><a href="index-18.html">18 - fashion store (with sidebar)</a></li>
                                            <li><a href="index-19.html">19 - games store</a></li>
                                            <li><a href="index-20.html">20 - book store</a></li>
                                            <li><a href="index-21.html">21 - sport store</a></li>
                                            <li><a href="index-22.html">22 - tools store</a></li>
                                            <li><a href="index-23.html">23 - fashion left navigation store</a></li>
                                            <li><a href="index-24.html">24 - extreme sport store</a></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a href="category.html">Shop</a>
                                        <ul>
                                            <li><a href="category-list.html">Shop List</a></li>
                                            <li><a href="category-2cols.html">Shop Grid 2 Columns</a></li>
                                            <li><a href="category.html">Shop Grid 3 Columns</a></li>
                                            <li><a href="category-4cols.html">Shop Grid 4 Columns</a></li>
                                            <li><a href="category-boxed.html"><span>Shop Boxed No Sidebar<span className="tip tip-hot">Hot</span></span></a></li>
                                            <li><a href="category-fullwidth.html">Shop Fullwidth No Sidebar</a></li>
                                            <li><a href="product-category-boxed.html">Product Category Boxed</a></li>
                                            <li><a href="product-category-fullwidth.html"><span>Product Category Fullwidth<span className="tip tip-new">New</span></span></a></li>
                                            <li><a href="cart.html">Cart</a></li>
                                            <li><a href="checkout.html">Checkout</a></li>
                                            <li><a href="wishlist.html">Wishlist</a></li>
                                            <li><a href="#">Lookbook</a></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a href="product.html" className="sf-with-ul">Product</a>
                                        <ul>
                                            <li><a href="product.html">Default</a></li>
                                            <li><a href="product-centered.html">Centered</a></li>
                                            <li><a href="product-extended.html"><span>Extended Info<span className="tip tip-new">New</span></span></a></li>
                                            <li><a href="product-gallery.html">Gallery</a></li>
                                            <li><a href="product-sticky.html">Sticky Info</a></li>
                                            <li><a href="product-sidebar.html">Boxed With Sidebar</a></li>
                                            <li><a href="product-fullwidth.html">Full Width</a></li>
                                            <li><a href="product-masonry.html">Masonry Sticky Info</a></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a href="#">Pages</a>
                                        <ul>
                                            <li>
                                                <a href="about.html">About</a>
                                                <ul>
                                                    <li><a href="about.html">About 01</a></li>
                                                    <li><a href="about-2.html">About 02</a></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a href="contact.html">Contact</a>
                                                <ul>
                                                    <li><a href="contact.html">Contact 01</a></li>
                                                    <li><a href="contact-2.html">Contact 02</a></li>
                                                </ul>
                                            </li>
                                            <li><a href="login.html">Login</a></li>
                                            <li><a href="faq.html">FAQs</a></li>
                                            <li><a href="404.html">Error 404</a></li>
                                            <li><a href="coming-soon.html">Coming Soon</a></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a href="blog.html">Blog</a>
                                        <ul>
                                            <li><a href="blog.html">Classic</a></li>
                                            <li><a href="blog-listing.html">Listing</a></li>
                                            <li>
                                                <a href="#">Grid</a>
                                                <ul>
                                                    <li><a href="blog-grid-2cols.html">Grid 2 columns</a></li>
                                                    <li><a href="blog-grid-3cols.html">Grid 3 columns</a></li>
                                                    <li><a href="blog-grid-4cols.html">Grid 4 columns</a></li>
                                                    <li><a href="blog-grid-sidebar.html">Grid sidebar</a></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a href="#">Masonry</a>
                                                <ul>
                                                    <li><a href="blog-masonry-2cols.html">Masonry 2 columns</a></li>
                                                    <li><a href="blog-masonry-3cols.html">Masonry 3 columns</a></li>
                                                    <li><a href="blog-masonry-4cols.html">Masonry 4 columns</a></li>
                                                    <li><a href="blog-masonry-sidebar.html">Masonry sidebar</a></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a href="#">Mask</a>
                                                <ul>
                                                    <li><a href="blog-mask-grid.html">Blog mask grid</a></li>
                                                    <li><a href="blog-mask-masonry.html">Blog mask masonry</a></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a href="#">Single Post</a>
                                                <ul>
                                                    <li><a href="single.html">Default with sidebar</a></li>
                                                    <li><a href="single-fullwidth.html">Fullwidth no sidebar</a></li>
                                                    <li><a href="single-fullwidth-sidebar.html">Fullwidth with sidebar</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a href="elements-list.html">Elements</a>
                                        <ul>
                                            <li><a href="elements-products.html">Products</a></li>
                                            <li><a href="elements-typography.html">Typography</a></li>
                                            <li><a href="elements-titles.html">Titles</a></li>
                                            <li><a href="elements-banners.html">Banners</a></li>
                                            <li><a href="elements-product-category.html">Product Category</a></li>
                                            <li><a href="elements-video-banners.html">Video Banners</a></li>
                                            <li><a href="elements-buttons.html">Buttons</a></li>
                                            <li><a href="elements-accordions.html">Accordions</a></li>
                                            <li><a href="elements-tabs.html">Tabs</a></li>
                                            <li><a href="elements-testimonials.html">Testimonials</a></li>
                                            <li><a href="elements-blog-posts.html">Blog Posts</a></li>
                                            <li><a href="elements-portfolio.html">Portfolio</a></li>
                                            <li><a href="elements-cta.html">Call to Action</a></li>
                                            <li><a href="elements-icon-boxes.html">Icon Boxes</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </nav>{/* End .mobile-nav */}
                        </div>{/* .End .tab-pane */}
                        <div className="tab-pane fade" id="mobile-cats-tab" role="tabpanel" aria-labelledby="mobile-cats-link">
                            <nav className="mobile-cats-nav">
                                <ul className="mobile-cats-menu">
                                    <li><a className="mobile-cats-lead" href="#">Daily offers</a></li>
                                    <li><a className="mobile-cats-lead" href="#">Gift Ideas</a></li>
                                    <li><a href="#">Beds</a></li>
                                    <li><a href="#">Lighting</a></li>
                                    <li><a href="#">Sofas &amp; Sleeper sofas</a></li>
                                    <li><a href="#">Storage</a></li>
                                    <li><a href="#">Armchairs &amp; Chaises</a></li>
                                    <li><a href="#">Decoration </a></li>
                                    <li><a href="#">Kitchen Cabinets</a></li>
                                    <li><a href="#">Coffee &amp; Tables</a></li>
                                    <li><a href="#">Outdoor Furniture </a></li>
                                </ul>{/* End .mobile-cats-menu */}
                            </nav>{/* End .mobile-cats-nav */}
                        </div>{/* .End .tab-pane */}
                    </div>{/* End .tab-content */}
                    <div className="social-icons">
                        <a href="#" className="social-icon" target="_blank" title="Facebook"><i className="icon-facebook-f" /></a>
                        <a href="#" className="social-icon" target="_blank" title="Twitter"><i className="icon-twitter" /></a>
                        <a href="#" className="social-icon" target="_blank" title="Instagram"><i className="icon-instagram" /></a>
                        <a href="#" className="social-icon" target="_blank" title="Youtube"><i className="icon-youtube" /></a>
                    </div>{/* End .social-icons */}
                </div>{/* End .mobile-menu-wrapper */}
            </div>{/* End .mobile-menu-container */}
            <LoginForm></LoginForm>
        </div>
    );
}
export default Category;