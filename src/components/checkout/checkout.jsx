import React, { useContext, useEffect, useState } from "react";
import { NavLink , useNavigate} from "react-router-dom";
import axios from "axios";
import { PATH } from "../../constants/API";
import { CartContext } from "../helpers/context/cart-context";
import { Simplert } from "react-simplert";
import { AuthContext } from "../helpers/context/auth-context";
import StripeButton from "../helpers/stripe-button";
function Checkout() {
    
    const [userCart, setUserCart] = useState(undefined);
    const [deletingItem, setDeletingItem] = useState(-1)
    const cartContext = useContext(CartContext)
    const authContext = useContext(AuthContext)
    const [orderSubmited,setOrderSubmited] = useState(false); 
    
    const navigate = useNavigate();
    const [orderForm,setOrderForm] = useState({
        name: "",
        address: "",
        city:"",
        distric:"",
        zipCode: "",
        phoneNumber:"",
        email:"",
        note:"",
        paymentMethod:"cod",
        isPaid:""
    })

    const handleNameInputChange = (event) => {
      event.persist();
      setOrderForm((orderForm) => ({
        ...orderForm,
        name: event.target.value,
      }));
    };
    const handleAddressInputChange = (event) => {
      event.persist();
      setOrderForm((orderForm) => ({
        ...orderForm,
        address: event.target.value,
      }));
    };
    const handleCityInputChange = (event) => {
      event.persist();
      setOrderForm((orderForm) => ({
        ...orderForm,
        city: event.target.value,
      }));
    };
    const handleDistricInputChange = (event) => {
      event.persist();
      setOrderForm((orderForm) => ({
        ...orderForm,
        distric: event.target.value,
      }));
    };
    const handleZipCodeInputChange = (event) => {
      event.persist();
      setOrderForm((orderForm) => ({
        ...orderForm,
        zipCode: event.target.value,
      }));
    };
    const handlePhoneNumberInputChange = (event) => {
      event.persist();
      setOrderForm((orderForm) => ({
        ...orderForm,
        phoneNumber: event.target.value,
      }));
    };
    const handleNoteInputChange = (event) => {
      event.persist();
      setOrderForm((orderForm) => ({
        ...orderForm,
        note: event.target.value,
      }));
    };
    const handleEmailInputChange = (event) => {
      event.persist();
      setOrderForm((orderForm) => ({
        ...orderForm,
        email: event.target.value,
      }));
    };
    const handlePaymentInputChange = (event,value) => {
      console.log(event)
      event.persist();
      setOrderForm((orderForm) => ({
        ...orderForm,
        paymentMethod: value,
      }));
    };
    useEffect(
        () => {
            async function getUserInfo() {
                try {
                    if (authContext.isAuthenticated) {
                        const token = 'Bearer ' + localStorage.getItem("token")
                        console.log(token)
                        const response = await axios.get(PATH.API_ROOT_URL + PATH.API_ORDER + "/cart/user", {
                            headers: {
                                'Authorization': token
                            }
                        });
                        console.log(response.data)
                        setUserCart(response.data)
                    }
                } catch (error) {
                    console.error(error.message)
                }
            }
            getUserInfo()
        }
        , [cartContext])

    useEffect(
        () => {
            async function deleteItem() {
                try {
                    console.log(deletingItem)
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


    const handleRemoveCartItem = (index) => {
        setDeletingItem(index)
    }
    const submitForm = async () => {
        console.log(orderForm)
        try {
          await axios.post(PATH.API_ROOT_URL + PATH.API_ORDER + "/order/create", {
            name: orderForm.name,
        address: orderForm.address + ", "+ orderForm.distric + ", "+ orderForm.city,
        
        zipCode: orderForm.zipCode,
        phoneNumber:orderForm.phoneNumber,
        email:orderForm.email,
        note:orderForm.note,
        paymentMethod:orderForm.paymentMethod,
        isPaid:orderForm.paymentMethod!=="cod"?true:false
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });
        setOrderSubmited(true)
        alert("Đặt hàng thành công")
        
        } catch (error) {
          
        }
        
    }
    useEffect(() => {
      async function redirect() {
          try {
              if (orderSubmited) {
                (cartContext.toggleCartReload)()
              navigate("/")
              }
          } catch (error) {
              console.error(error.message)
          }
      }
      redirect();
  }
  , [orderSubmited])
    return (
      userCart?
        <div>

        <div className="page-wrapper">
          <main className="main">
            <div className="page-header text-center" style={{backgroundImage: 'url("assets/images/page-header-bg.jpg")'}}>
              <div className="container">
                <h1 className="page-title">Đặt Hàng<span>Shop</span></h1>
              </div>{/* End .container */}
            </div>{/* End .page-header */}
            <nav aria-label="breadcrumb" className="breadcrumb-nav">
              <div className="container">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><NavLink to="/" >Trang chủ</NavLink></li>
                  <li className="breadcrumb-item active" aria-current="page">Đặt Hàng</li>
                </ol>
              </div>{/* End .container */}
            </nav>{/* End .breadcrumb-nav */}
            <div className="page-content">
              <div className="checkout">
                <div className="container">
                  <div className="checkout-discount">
                  </div>
                  <form >
                    <div className="row">
                      <div className="col-lg-9">
                        <h2 className="checkout-title">Thông tin đơn hàng</h2>{/* End .checkout-title */}
                        <label>Họ tên người nhận hàng *</label>
                        <input type="text" className="form-control" placeholder="Họ tên" required value={orderForm.name} onChange={handleNameInputChange}/>
                        <label>Địa chỉ *</label>
                        <input type="text" className="form-control" placeholder="Số nhà, tên đường" required value={orderForm.address} onChange={handleAddressInputChange}/>
                        <div className="row">
                          <div className="col-sm-6">
                            <label>Tỉnh / Thành Phố *</label>
                            <input type="text" className="form-control" required value={orderForm.city} onChange={handleCityInputChange}/>
                          </div>{/* End .col-sm-6 */}
                          <div className="col-sm-6">
                            <label>Quận / Thị Xã*</label>
                            <input type="text" className="form-control" required value={orderForm.distric} onChange={handleDistricInputChange}/>
                          </div>{/* End .col-sm-6 */}
                        </div>{/* End .row */}
                        <div className="row">
                          <div className="col-sm-6">
                            <label>Mã ZIP *</label>
                            <input type="text" className="form-control" required value={orderForm.zipCode} onChange={handleZipCodeInputChange}/>
                          </div>{/* End .col-sm-6 */}
                          <div className="col-sm-6">
                            <label>Số điện thoại *</label>
                            <input type="tel" className="form-control" required value={orderForm.phoneNumber} onChange={handlePhoneNumberInputChange}/>
                          </div>{/* End .col-sm-6 */}
                        </div>{/* End .row */}
                        <label>Địa chỉ email *</label>
                        <input type="email" className="form-control" required value={orderForm.email} onChange={handleEmailInputChange}/>
                        <label>Ghi chú</label>
                        <textarea className="form-control" cols={30} rows={4} placeholder="Thời gian giao hàng, nơi giao hàng,..." defaultValue={""} value={orderForm.note} onChange={handleNoteInputChange}/>
                      </div>{/* End .col-lg-9 */}
                      <aside className="col-lg-3">
                        <div className="summary">
                          <h3 className="summary-title">Đơn hàng của bạn</h3>{/* End .summary-title */}
                          <table className="table table-summary">
                            <thead>
                              <tr>
                                <th>Sản Phẩm</th>
                                <th>Tổng cộng</th>
                              </tr>
                            </thead>
                            <tbody>
                            {userCart.cartItemDtos.map((item,index) => (
                    <tr>
                      <td>
                        
                          <NavLink to={"/product/"+item.productDto.code} >{item.productDto.name +" " + item.inventoryItem.productAttributeValues.reduce((string, current) => string += current.attributeValue + " ", "")}</NavLink>
                      </td>
                      <td >{item.inventoryItem.retailPrice * item.units} VNĐ</td>
                    </tr>))}
                              
                              <tr>
                                <td>Vận chuyển:</td>
                                <td>Miễn phí</td>
                              </tr>
                              <tr className="summary-total">
                                <td>Tổng cộng:</td>
                                <td>{userCart.totals}</td>
                              </tr>{/* End .summary-total */}
                            </tbody>
                          </table>{/* End .table table-summary */}
                          <div className="accordion-summary" id="accordion-payment">
                          <div className="card">
                              <div className="card-header" id="heading-1">
                                <h2 className="card-title">
                                  <a role="button" data-toggle="collapse" href="#collapse-1" aria-expanded="true" aria-controls="collapse-1" onClick={(e)=> handlePaymentInputChange(e,"cod")}>
                                    Trả tiền khi nhận hàng
                                  </a>
                                </h2>
                              </div>{/* End .card-header */}
                              <div id="collapse-1" className="collapse show" aria-labelledby="heading-1" data-parent="#accordion-payment">
                                <div className="card-body">Bạn sẽ trả tiền khi đơn hàng được giao đến bạn
                                </div>{/* End .card-body */}
                              </div>{/* End .collapse */}
                            </div>{/* End .card */}
                            <div className="card">
                              <div className="card-header" id="heading-2">
                                <h2 className="card-title">
                                  <a className="collapsed" role="button" data-toggle="collapse" href="#collapse-2" aria-expanded="false" aria-controls="collapse-2" onClick={(e)=>handlePaymentInputChange(e,"direct transfer")}>
                                    Chuyển khoản trực tiếp
                                  </a>
                                </h2>
                              </div>{/* End .card-header */}
                              <div id="collapse-2" className="collapse" aria-labelledby="heading-2" data-parent="#accordion-payment">
                                <div className="card-body">
                                  Chuyển khoản vào tài khoản ngân hàng của chúng tôi
                                </div>{/* End .card-body */}
                              </div>{/* End .collapse */}
                            </div>{/* End .card */}
                            <div className="card">
                              <div className="card-header" id="heading-3">
                                <h2 className="card-title">
                                  <a className="collapsed" role="button" data-toggle="collapse" href="#collapse-3" aria-expanded="false" aria-controls="collapse-3" onClick={(e)=>handlePaymentInputChange(e,"paid")}>
                                    Thanh toán trưc tiếp
                                  </a>
                                </h2>
                              </div>{/* End .card-header */}
                              <div id="collapse-3" className="collapse" aria-labelledby="heading-3" data-parent="#accordion-payment">
                                <div className="card-body">
                                  Thanh toán trực tiếp đơn hàng
                                </div>{/* End .card-body */}
                              </div>{/* End .collapse */}
                            </div>{/* End .card */}
                            
                            
                            
                          </div>{/* End .accordion */}
                          {orderForm.paymentMethod === "paid"? 
                          <StripeButton price={userCart.totals} submitFunction={submitForm}/> :
                          <button type="button" onClick={submitForm} className="btn btn-outline-primary-2 btn-order btn-block">
                            <span className="btn-text">Đặt hàng</span>
                            <span className="btn-hover-text">Đặt hàng</span>
                          </button>
                        }
                          
                        </div>{/* End .summary */}
                      </aside>{/* End .col-lg-3 */}
                    </div>{/* End .row */}
                  </form>
                </div>{/* End .container */}
              </div>{/* End .checkout */}
            </div>{/* End .page-content */}
          </main>{/* End .main */}
        </div>{/* End .page-wrapper */}
        <button id="scroll-top" title="Back to Top"><i className="icon-arrow-up" /></button>
      </div>
       :<div></div> )
}
export default Checkout;