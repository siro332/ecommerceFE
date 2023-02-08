import { React, useContext, useEffect, useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import axios from "axios";
import { PATH } from "../../constants/API";
import { CartContext } from "../helpers/context/cart-context";
import CategoryProduct from "../home/components/categoryProduct";
import { AuthContext } from "../helpers/context/auth-context";
function Product() {
    const productCode = useParams();
    const [product, setProduct] = useState(undefined);
    const [allowAddToCart, setAllowAddToCart] = useState(false)
    const [productLoading, setProductLoading] = useState(true);
    const [imageIndex, setImageIndex] = useState(0);
    const [productInventorySku, setProductInventorySku] = useState("");
    const [units, setUnits] = useState(1);

    const context = useContext(CartContext);
    
    const authContext = useContext(AuthContext);

    const handleProductTypeChange = (e) => {
        if (e.target.value !== "#") {
            setAllowAddToCart(true)
        } else {
            setAllowAddToCart(false)
        }
        setProductInventorySku(e.target.value)
        setUnits(1)

    }
    const handleAddToCart = async () => {
        if(authContext.isAuthenticated){
            if (productInventorySku !== "#") {
                await axios.post(PATH.API_ROOT_URL + PATH.API_ORDER + "/cart/addToCart", {
                    productCode: productCode.id,
                    productInventory: productInventorySku,
                    units: units
                }, {
                    headers: {
                        'Authorization': 'bearer ' + localStorage.getItem("token")
                    }
                });
                (context.toggleCartReload)()
            }
        }else{
            alert("Vui lòng đăng nhập để thêm giỏ hàng")
        }
    }
    useEffect(
        () => {
            async function addToCart() {
            }
            addToCart();
        }, [units, allowAddToCart]);
    useEffect(
        () => {
            async function fetchData() {
                // You can await here
                setProductLoading(true);
                try {
                    const response = await axios.get(PATH.API_ROOT_URL + PATH.API_CATALOG + "/products/product/" + productCode.id);
                    setProduct(response.data);
                    if (response.data.productInventories.length>0){
                        setProductInventorySku(response.data.productInventories[0].sku)
                    }
                    console.log(response.data.productInventories[0] )
                } catch (error) {
                    console.error(error.message);
                }
                setProductLoading(false);
            }
            fetchData();
        }, [productCode.id]);
    return (
        product ?
            <div>
                <div className="page-wrapper">
                    <main className="main">
                        <nav aria-label="breadcrumb" className="breadcrumb-nav border-0 mb-0">
                            <div className="container d-flex align-items-center">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><NavLink to="/" >Trang chủ</NavLink></li>
                                    <li className="breadcrumb-item"><NavLink to={"/category/" + product.categories[0].code} >{product.categories != null ? product.categories[0].name : ""}</NavLink></li>

                                    <li className="breadcrumb-item active" aria-current="page">{product ? product.name : ""}</li>
                                </ol>

                            </div>{/* End .container */}
                        </nav>{/* End .breadcrumb-nav */}
                        <div className="page-content">
                            <div className="container">
                                <div className="product-details-top">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="product-gallery product-gallery-vertical">
                                                <div className="row">
                                                    <figure className="product-main-image">
                                                        {product.mediaList.length > 0 &&
                                                            <div>
                                                                <img id="product-zoom" src={product.mediaList[imageIndex].imgUrl} alt={product.mediaList[0].altText}></img>
                                                            </div>
                                                        }

                                                    </figure>{/* End .product-main-image */}
                                                    <div id="product-zoom-gallery" className="product-image-gallery">
                                                        {product.mediaList.length > 0 &&
                                                            product.mediaList.map((item, index) => (
                                                                <div>
                                                                    <a className={imageIndex == index ? "product-gallery-item active" : "product-gallery-item"} onClick={() => setImageIndex(index)} data-image={product.mediaList[index].imgUrl} data-zoom-image={product.mediaList[index].imgUrl}>
                                                                        <img src={product.mediaList[index].imgUrl} alt="product side" />
                                                                    </a>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>{/* End .product-image-gallery */}
                                                </div>{/* End .row */}
                                            </div>{/* End .product-gallery */}
                                        </div>{/* End .col-md-6 */}
                                        <div className="col-md-6">
                                            <div className="product-details">
                                                <h1 className="product-title">{product ? product.name : ""}</h1>{/* End .product-title */}
                                                <div className="ratings-container">
                                                    <div className="ratings">
                                                        <div className="ratings-val" style={{ width: '80%' }} />{/* End .ratings-val */}
                                                    </div>{/* End .ratings */}
                                                    <a className="ratings-text" href="#product-review-link" id="review-link">( 2 Reviews )</a>
                                                </div>{/* End .rating-container */}
                                                <div className="product-price">
                                                    {product.productInventories.find((inventory) => inventory.sku === productInventorySku) != null ?
                                                        product.productInventories.find((inventory) => inventory.sku === productInventorySku).retailPrice + " VND" : "Hết Hàng"}
                                                </div>{/* End .product-price */}
                                                {product.productInventories.length === 1 ? <div></div>:<div className="details-filter-row details-row-size">
                                                    <label htmlFor="type">Loại Hàng:</label>
                                                    <div className="select-custom">
                                                        <select name="type" id="type" defaultValue={"#"} className="form-control" onChange={handleProductTypeChange}>
                                                            <option value="#" >Chọn loại hàng</option>
                                                            {product.productInventories.length > 0 ? product.productInventories.map((item, index) => (
                                                                <option value={item.sku}>{item.productAttributeValues.length > 0 ? item.productAttributeValues.reduce((string, current) => string += current.attributeValue + " ", "") : ""}</option>
                                                            )) : <option></option>}
                                                        </select>
                                                    </div>{/* End .select-custom */}
                                                </div>}
                                                <div className="details-filter-row details-row-size">
                                                    <label htmlFor="qty">Số Lượng:</label>
                                                    <div className="product-details-quantity">
                                                        <input value ={units} type="number" id="qty" className="form-control" defaultValue={1} min={1} max={product.productInventories.find((inventory) => inventory.sku === productInventorySku) != null ?
                                                            product.productInventories.find((inventory) => inventory.sku === productInventorySku).units : 1} step={1} data-decimals={0} required onChange={e => setUnits(e.target.value)} />
                                                    </div>{/* End .product-details-quantity */}
                                                </div>{/* End .details-filter-row */}
                                                <div className="product-details-action">
                                                    <button disabled = {!allowAddToCart} onClick={() => handleAddToCart()} className="btn-product btn-cart"><span>thêm vào giỏ</span></button>
                                                    {/* <div className="details-action-wrapper">
                                                        <a href="#" className="btn-product btn-wishlist" title="Wishlist"><span>thêm vào yêu thích</span></a>
                                                    </div> */}
                                                </div>{/* End .product-details-action */}
                                                <div className="product-details-footer">
                                                    <div className="product-cat">
                                                        <span>Danh mục:</span>
                                                        {product.categories.length > 0 &&
                                                            product.categories.map((item, index) => (
                                                                <NavLink to={"/category/" + item.code}>{item.name} </NavLink>
                                                            ))
                                                        }
                                                    </div>{/* End .product-cat */}
                                                    <div className="social-icons social-icons-sm">
                                                        <span className="social-label">Chia sẻ:</span>
                                                        <a href="#" className="social-icon" title="Facebook" target="_blank"><i className="icon-facebook-f" /></a>
                                                        <a href="#" className="social-icon" title="Twitter" target="_blank"><i className="icon-twitter" /></a>
                                                        <a href="#" className="social-icon" title="Instagram" target="_blank"><i className="icon-instagram" /></a>
                                                        <a href="#" className="social-icon" title="Pinterest" target="_blank"><i className="icon-pinterest" /></a>
                                                    </div>
                                                </div>{/* End .product-details-footer */}
                                            </div>{/* End .product-details */}
                                        </div>{/* End .col-md-6 */}
                                    </div>{/* End .row */}
                                </div>{/* End .product-details-top */}
                                <div className="product-details-tab">
                                    <ul className="nav nav-pills justify-content-center" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link active" id="product-desc-link" data-toggle="tab" href="#product-desc-tab" role="tab" aria-controls="product-desc-tab" aria-selected="true">Mô tả</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" id="product-review-link" data-toggle="tab" href="#product-review-tab" role="tab" aria-controls="product-review-tab" aria-selected="false">Đánh giá (2)</a>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        <div className="tab-pane fade show active" id="product-desc-tab" role="tabpanel" aria-labelledby="product-desc-link">
                                            <div className="product-desc-content">
                                                {product.description}
                                            </div>{/* End .product-desc-content */}
                                        </div>{/* .End .tab-pane */}
                                        <div className="tab-pane fade" id="product-info-tab" role="tabpanel" aria-labelledby="product-info-link">
                                            <div className="product-desc-content">
                                                <h3>Information</h3>
                                                <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna viverra non, semper suscipit, posuere a, pede. Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci. </p>
                                                <h3>Fabric &amp; care</h3>
                                                <ul>
                                                    <li>Faux suede fabric</li>
                                                    <li>Gold tone metal hoop handles.</li>
                                                    <li>RI branding</li>
                                                    <li>Snake print trim interior </li>
                                                    <li>Adjustable cross body strap</li>
                                                    <li> Height: 31cm; Width: 32cm; Depth: 12cm; Handle Drop: 61cm</li>
                                                </ul>
                                                <h3>Size</h3>
                                                <p>one size</p>
                                            </div>{/* End .product-desc-content */}
                                        </div>{/* .End .tab-pane */}
                                        <div className="tab-pane fade" id="product-shipping-tab" role="tabpanel" aria-labelledby="product-shipping-link">
                                            <div className="product-desc-content">
                                                <h3>Delivery &amp; returns</h3>
                                                <p>We deliver to over 100 countries around the world. For full details of the delivery options we offer, please view our <a href="#">Delivery information</a><br />
                                                    We hope you’ll love every purchase, but if you ever need to return an item you can do so within a month of receipt. For full details of how to make a return, please view our <a href="#">Returns information</a></p>
                                            </div>{/* End .product-desc-content */}
                                        </div>{/* .End .tab-pane */}
                                        <div className="tab-pane fade" id="product-review-tab" role="tabpanel" aria-labelledby="product-review-link">
                                            <div className="reviews">
                                                <h3>Reviews (2)</h3>
                                                <div className="review">
                                                    <div className="row no-gutters">
                                                        <div className="col-auto">
                                                            <h4><a href="#">Samanta J.</a></h4>
                                                            <div className="ratings-container">
                                                                <div className="ratings">
                                                                    <div className="ratings-val" style={{ width: '80%' }} />{/* End .ratings-val */}
                                                                </div>{/* End .ratings */}
                                                            </div>{/* End .rating-container */}
                                                            <span className="review-date">6 days ago</span>
                                                        </div>{/* End .col */}
                                                        <div className="col">
                                                            <h4>Good, perfect size</h4>
                                                            <div className="review-content">
                                                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus cum dolores assumenda asperiores facilis porro reprehenderit animi culpa atque blanditiis commodi perspiciatis doloremque, possimus, explicabo, autem fugit beatae quae voluptas!</p>
                                                            </div>{/* End .review-content */}
                                                            <div className="review-action">
                                                                <a href="#"><i className="icon-thumbs-up" />Helpful (2)</a>
                                                                <a href="#"><i className="icon-thumbs-down" />Unhelpful (0)</a>
                                                            </div>{/* End .review-action */}
                                                        </div>{/* End .col-auto */}
                                                    </div>{/* End .row */}
                                                </div>{/* End .review */}
                                                <div className="review">
                                                    <div className="row no-gutters">
                                                        <div className="col-auto">
                                                            <h4><a href="#">John Doe</a></h4>
                                                            <div className="ratings-container">
                                                                <div className="ratings">
                                                                    <div className="ratings-val" style={{ width: '100%' }} />{/* End .ratings-val */}
                                                                </div>{/* End .ratings */}
                                                            </div>{/* End .rating-container */}
                                                            <span className="review-date">5 days ago</span>
                                                        </div>{/* End .col */}
                                                        <div className="col">
                                                            <h4>Very good</h4>
                                                            <div className="review-content">
                                                                <p>Sed, molestias, tempore? Ex dolor esse iure hic veniam laborum blanditiis laudantium iste amet. Cum non voluptate eos enim, ab cumque nam, modi, quas iure illum repellendus, blanditiis perspiciatis beatae!</p>
                                                            </div>{/* End .review-content */}
                                                            <div className="review-action">
                                                                <a href="#"><i className="icon-thumbs-up" />Helpful (0)</a>
                                                                <a href="#"><i className="icon-thumbs-down" />Unhelpful (0)</a>
                                                            </div>{/* End .review-action */}
                                                        </div>{/* End .col-auto */}
                                                    </div>{/* End .row */}
                                                </div>{/* End .review */}
                                            </div>{/* End .reviews */}
                                        </div>{/* .End .tab-pane */}
                                    </div>{/* End .tab-content */}
                                </div>{/* End .product-details-tab */}
                                <h2 className="title text-center mb-4">Gợi Ý Sản Phẩm</h2>{/* End .title text-center */}
                                {product.categories.length > 0 ? <CategoryProduct category={product.categories.slice(-1)[0]}></CategoryProduct> :<div></div>}
                            </div>{/* End .container */}
                        </div>{/* End .page-content */}
                    </main>{/* End .main */}

                </div>{/* End .page-wrapper */}
                <button id="scroll-top" title="Back to Top"><i className="icon-arrow-up" /></button>
                {/* Sticky Bar */}
                <div className="sticky-bar">
                    <div className="container">
                        <div className="row">
                            <div className="col-6">
                                <figure className="product-media">
                                {product.mediaList.length > 0 &&
                                                            <div>
                                                                <img src={product.mediaList[imageIndex].imgUrl} alt={product.mediaList[0].altText}></img>
                                                            </div>
                                                        }
                                </figure>{/* End .product-media */}
                                <h4 className="product-title"><NavLink to={"/product/"+product.code}>{product ? product.name : ""}</NavLink></h4>{/* End .product-title */}
                            </div>{/* End .col-6 */}
                            <div className="col-6 justify-content-end">
                                <div className="product-price">
                                {product.productInventories.find((inventory) => inventory.sku === productInventorySku) != null ?
                                                        product.productInventories.find((inventory) => inventory.sku === productInventorySku).retailPrice : 0} VND
                                </div>{/* End .product-price */}
                                <div className="product-details-quantity">
                                    <input value={units} type="number" id="sticky-cart-qty" className="form-control" defaultValue={1} min={1} max={10} step={1} data-decimals={0} required />
                                </div>{/* End .product-details-quantity */}
                                <div className="product-details-action">
                                    <button disabled = {!allowAddToCart} onClick={() => handleAddToCart()} className="btn-product btn-cart"><span>Thêm vào giỏ</span></button>
                                    <a href="#" className="btn-product btn-wishlist" title="Wishlist"><span>Add to Wishlist</span></a>
                                </div>{/* End .product-details-action */}
                            </div>{/* End .col-6 */}
                        </div>{/* End .row */}
                    </div>{/* End .container */}
                </div>{/* End .sticky-bar */}
                {/* Mobile Menu */}
                <div className="mobile-menu-overlay" />{/* End .mobil-menu-overlay */}
                <div className="mobile-menu-container">
                    <div className="mobile-menu-wrapper">
                        <span className="mobile-menu-close"><i className="icon-close" /></span>
                        <form action="#" method="get" className="mobile-search">
                            <label htmlFor="mobile-search" className="sr-only">Search</label>
                            <input type="search" className="form-control" name="mobile-search" id="mobile-search" placeholder="Search in..." required />
                            <button className="btn btn-primary" type="submit"><i className="icon-search" /></button>
                        </form>
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
                        <div className="social-icons">
                            <a href="#" className="social-icon" target="_blank" title="Facebook"><i className="icon-facebook-f" /></a>
                            <a href="#" className="social-icon" target="_blank" title="Twitter"><i className="icon-twitter" /></a>
                            <a href="#" className="social-icon" target="_blank" title="Instagram"><i className="icon-instagram" /></a>
                            <a href="#" className="social-icon" target="_blank" title="Youtube"><i className="icon-youtube" /></a>
                        </div>{/* End .social-icons */}
                    </div>{/* End .mobile-menu-wrapper */}
                </div>{/* End .mobile-menu-container */}
                {/* Sign in / Register Modal */}
                <div className="modal fade" id="signin-modal" tabIndex={-1} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true"><i className="icon-close" /></span>
                                </button>
                                <div className="form-box">
                                    <div className="form-tab">
                                        <ul className="nav nav-pills nav-fill" role="tablist">
                                            <li className="nav-item">
                                                <a className="nav-link active" id="signin-tab" data-toggle="tab" href="#signin" role="tab" aria-controls="signin" aria-selected="true">Sign In</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" id="register-tab" data-toggle="tab" href="#register" role="tab" aria-controls="register" aria-selected="false">Register</a>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="tab-content-5">
                                            <div className="tab-pane fade show active" id="signin" role="tabpanel" aria-labelledby="signin-tab">
                                                <form action="#">
                                                    <div className="form-group">
                                                        <label htmlFor="singin-email">Username or email address *</label>
                                                        <input type="text" className="form-control" id="singin-email" name="singin-email" required />
                                                    </div>{/* End .form-group */}
                                                    <div className="form-group">
                                                        <label htmlFor="singin-password">Password *</label>
                                                        <input type="password" className="form-control" id="singin-password" name="singin-password" required />
                                                    </div>{/* End .form-group */}
                                                    <div className="form-footer">
                                                        <button type="submit" className="btn btn-outline-primary-2">
                                                            <span>LOG IN</span>
                                                            <i className="icon-long-arrow-right" />
                                                        </button>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="signin-remember" />
                                                            <label className="custom-control-label" htmlFor="signin-remember">Remember Me</label>
                                                        </div>{/* End .custom-checkbox */}
                                                        <a href="#" className="forgot-link">Forgot Your Password?</a>
                                                    </div>{/* End .form-footer */}
                                                </form>
                                                <div className="form-choice">
                                                    <p className="text-center">or sign in with</p>
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <a href="#" className="btn btn-login btn-g">
                                                                <i className="icon-google" />
                                                                Login With Google
                                                            </a>
                                                        </div>{/* End .col-6 */}
                                                        <div className="col-sm-6">
                                                            <a href="#" className="btn btn-login btn-f">
                                                                <i className="icon-facebook-f" />
                                                                Login With Facebook
                                                            </a>
                                                        </div>{/* End .col-6 */}
                                                    </div>{/* End .row */}
                                                </div>{/* End .form-choice */}
                                            </div>{/* .End .tab-pane */}
                                            <div className="tab-pane fade" id="register" role="tabpanel" aria-labelledby="register-tab">
                                                <form action="#">
                                                    <div className="form-group">
                                                        <label htmlFor="register-email">Your email address *</label>
                                                        <input type="email" className="form-control" id="register-email" name="register-email" required />
                                                    </div>{/* End .form-group */}
                                                    <div className="form-group">
                                                        <label htmlFor="register-password">Password *</label>
                                                        <input type="password" className="form-control" id="register-password" name="register-password" required />
                                                    </div>{/* End .form-group */}
                                                    <div className="form-footer">
                                                        <button type="submit" className="btn btn-outline-primary-2">
                                                            <span>SIGN UP</span>
                                                            <i className="icon-long-arrow-right" />
                                                        </button>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="register-policy" required />
                                                            <label className="custom-control-label" htmlFor="register-policy">I agree to the <a href="#">privacy policy</a> *</label>
                                                        </div>{/* End .custom-checkbox */}
                                                    </div>{/* End .form-footer */}
                                                </form>
                                                <div className="form-choice">
                                                    <p className="text-center">or sign in with</p>
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <a href="#" className="btn btn-login btn-g">
                                                                <i className="icon-google" />
                                                                Login With Google
                                                            </a>
                                                        </div>{/* End .col-6 */}
                                                        <div className="col-sm-6">
                                                            <a href="#" className="btn btn-login  btn-f">
                                                                <i className="icon-facebook-f" />
                                                                Login With Facebook
                                                            </a>
                                                        </div>{/* End .col-6 */}
                                                    </div>{/* End .row */}
                                                </div>{/* End .form-choice */}
                                            </div>{/* .End .tab-pane */}
                                        </div>{/* End .tab-content */}
                                    </div>{/* End .form-tab */}
                                </div>{/* End .form-box */}
                            </div>{/* End .modal-body */}
                        </div>{/* End .modal-content */}
                    </div>{/* End .modal-dialog */}
                </div>
            </div> : <div></div>);
}
export default Product;