import React from "react";
function Footer(){
    return(
        <footer className="footer footer-2">
                    <div className="icon-boxes-container">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-6 col-lg-3">
                                    <div className="icon-box icon-box-side">
                                        <span className="icon-box-icon">
                                            <i className="icon-rocket" />
                                        </span>
                                        <div className="icon-box-content">
                                            <h3 className="icon-box-title">Miễn Phí Vận Chuyển</h3>{/* End .icon-box-title */}
                                            <p>Cho đơn hàng từ 300.000 VNĐ</p>
                                        </div>{/* End .icon-box-content */}
                                    </div>{/* End .icon-box */}
                                </div>{/* End .col-sm-6 col-lg-3 */}
                                <div className="col-sm-6 col-lg-3">
                                    <div className="icon-box icon-box-side">
                                        <span className="icon-box-icon">
                                            <i className="icon-rotate-left" />
                                        </span>
                                        <div className="icon-box-content">
                                            <h3 className="icon-box-title">Đổi Trả Miễn Phí</h3>{/* End .icon-box-title */}
                                            <p>Trong vòng 7 ngày</p>
                                        </div>{/* End .icon-box-content */}
                                    </div>{/* End .icon-box */}
                                </div>{/* End .col-sm-6 col-lg-3 */}
                                <div className="col-sm-6 col-lg-3">
                                    <div className="icon-box icon-box-side">
                                        <span className="icon-box-icon">
                                            <i className="icon-info-circle" />
                                        </span>
                                        <div className="icon-box-content">
                                            <h3 className="icon-box-title">Thanh Toán Dễ Dàng</h3>{/* End .icon-box-title */}
                                            <p>Hỗ trợ nhiều phương thức thanh toán</p>
                                        </div>{/* End .icon-box-content */}
                                    </div>{/* End .icon-box */}
                                </div>{/* End .col-sm-6 col-lg-3 */}
                                <div className="col-sm-6 col-lg-3">
                                    <div className="icon-box icon-box-side">
                                        <span className="icon-box-icon">
                                            <i className="icon-life-ring" />
                                        </span>
                                        <div className="icon-box-content">
                                            <h3 className="icon-box-title">Hỗ trợ tức thời</h3>{/* End .icon-box-title */}
                                            <p>Trực tổng đài 24/7</p>
                                        </div>{/* End .icon-box-content */}
                                    </div>{/* End .icon-box */}
                                </div>{/* End .col-sm-6 col-lg-3 */}
                            </div>{/* End .row */}
                        </div>{/* End .container */}
                    </div>{/* End .icon-boxes-container */}
                    <div className="footer-middle border-0">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 col-lg-6">
                                    <div className="widget widget-about">
                                        <img src="assets/images/demos/demo-13/logo-footer.png" className="footer-logo" alt="Footer Logo" width={105} height={25} />
                                        <p></p>
                                        <div className="widget-about-info">
                                            <div className="row">
                                                <div className="col-sm-6 col-md-4">
                                                    <span className="widget-about-title">Có câu hỏi? Hãy gọi cho chúng tôi 24/7</span>
                                                    <a href="tel:+84334998977">+84 334 998 977</a>
                                                </div>{/* End .col-sm-6 */}
                                                <div className="col-sm-6 col-md-8">
                                                    <span className="widget-about-title">Phương Thức Thanh Toán</span>
                                                    <figure className="footer-payments">
                                                        <img src="assets/images/payments.png" alt="Payment methods" width={272} height={20} />
                                                    </figure>{/* End .footer-payments */}
                                                </div>{/* End .col-sm-6 */}
                                            </div>{/* End .row */}
                                        </div>{/* End .widget-about-info */}
                                    </div>{/* End .widget about-widget */}
                                </div>{/* End .col-sm-12 col-lg-3 */}
                                <div className="col-sm-4 col-lg-2">
                                    <div className="widget">
                                        <h4 className="widget-title">Thông tin</h4>{/* End .widget-title */}
                                        <ul className="widget-list">
                                            <li><a href="about.html">Về chúng tôi</a></li>
                                            <li><a href="#">Cách mua hàng</a></li>
                                            <li><a href="faq.html">Câu hỏi thường gặp</a></li>
                                            <li><a href="contact.html">Liên hệ</a></li>
                                        </ul>{/* End .widget-list */}
                                    </div>{/* End .widget */}
                                </div>{/* End .col-sm-4 col-lg-3 */}
                                <div className="col-sm-4 col-lg-2">
                                    <div className="widget">
                                        <h4 className="widget-title">Chăm sóc khách hàng</h4>{/* End .widget-title */}
                                        <ul className="widget-list">
                                            <li><a href="#">Phương thức thanh toán</a></li>
                                            <li><a href="#">Chính sách hoàn trả</a></li>
                                            <li><a href="#">Vận chuyển</a></li>
                                            <li><a href="#">Điều khoản sử dụng</a></li>
                                        </ul>{/* End .widget-list */}
                                    </div>{/* End .widget */}
                                </div>{/* End .col-sm-4 col-lg-3 */}
                                
                            </div>{/* End .row */}
                        </div>{/* End .container */}
                    </div>{/* End .footer-middle */}
                    <div className="footer-bottom">
                        <div className="container">
                            
                            <div className="social-icons social-icons-color">
                                <span className="social-label">Mạng xã hội</span>
                                <a href="#" className="social-icon social-facebook" title="Facebook" target="_blank"><i className="icon-facebook-f" /></a>
                                <a href="#" className="social-icon social-twitter" title="Twitter" target="_blank"><i className="icon-twitter" /></a>
                                <a href="#" className="social-icon social-instagram" title="Instagram" target="_blank"><i className="icon-instagram" /></a>
                                <a href="#" className="social-icon social-youtube" title="Youtube" target="_blank"><i className="icon-youtube" /></a>
                                <a href="#" className="social-icon social-pinterest" title="Pinterest" target="_blank"><i className="icon-pinterest" /></a>
                            </div>{/* End .soial-icons */}
                        </div>{/* End .container */}
                    </div>{/* End .footer-bottom */}
                </footer>
    );
}
export default Footer;