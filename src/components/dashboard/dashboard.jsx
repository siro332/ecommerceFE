import { React, useState, useEffect, useContext } from "react"
import axios from 'axios';
import { NavLink, useParams } from "react-router-dom";
import { PATH } from "../../constants/API"
import Header from "../common/header";
import CategoryProduct from "../home/components/categoryProduct";
import { SearchContext } from "../helpers/context/search-context";
import { CartContext } from "../helpers/context/cart-context";
import { AuthContext } from "../helpers/context/auth-context";
function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [userAddressForm,setUserAddressForm] = useState({
        name: "",
        address: "",
        city:"",
        district:"",
        zipcode: "",
        phoneNumber:"",
        email:""
    })
    const authContext = useContext(AuthContext);
    const handleNameInputChange = (event) => {
        event.persist();
        setUserAddressForm((userAddressForm) => ({
          ...userAddressForm,
          name: event.target.value,
        }));
      };
      const handleAddressInputChange = (event) => {
        event.persist();
        setUserAddressForm((userAddressForm) => ({
          ...userAddressForm,
          address: event.target.value,
        }));
      };
      const handleCityInputChange = (event) => {
        event.persist();
        setUserAddressForm((userAddressForm) => ({
          ...userAddressForm,
          city: event.target.value,
        }));
      };
      const handleDistricInputChange = (event) => {
        event.persist();
        setUserAddressForm((userAddressForm) => ({
          ...userAddressForm,
          district: event.target.value,
        }));
      };
      const handleZipCodeInputChange = (event) => {
        event.persist();
        setUserAddressForm((userAddressForm) => ({
          ...userAddressForm,
          zipcode: event.target.value,
        }));
      };
      const handlePhoneNumberInputChange = (event) => {
        event.persist();
        setUserAddressForm((userAddressForm) => ({
          ...userAddressForm,
          phoneNumber: event.target.value,
        }));
      };
      const handleEmailInputChange = (event) => {
        event.persist();
        setUserAddressForm((userAddressForm) => ({
          ...userAddressForm,
          email: event.target.value,
        }));
      };
      const submitForm = async () => {
        console.log(userAddressForm)
        try {
          await axios.post(PATH.API_ROOT_URL + PATH.API_USER + "/info/add", {
            name: userAddressForm.name,
        address: userAddressForm.address,
        district: userAddressForm.district,
        city: userAddressForm.city,
        zipcode: userAddressForm.zipcode,
        phoneNumber:userAddressForm.phoneNumber,
        email:userAddressForm.email
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });
        } catch (error) {
          console.log(error)
        }
    }
    useEffect(
        () => {
            // async function getUserInfo() {
            //     try {
            //         if (keycloak.authenticated) {
            //             const token = 'Bearer ' + keycloak.token
            //             const response = await axios.get(PATH.API_ROOT_URL + PATH.API_USER + "/info/", {
            //                 headers: {
            //                     'Authorization': token
            //                 }
            //             });
            //             console.log(response.data)
            //             const addressform = {
            //                 name: response.name!=null?response.name:"",
            //                     address: response.address!=null?response.address:"",
            //                     city: response.city!=null?response.city:"",
            //                     district: response.district!=null?response.district:"",
            //                     zipcode: response.zipcode!=null?response.zipcode:"",
            //                     phoneNumber: response.phoneNumber!=null?response.phoneNumber:"",
            //                     email: response.email!=null?response.email:""
            //             }
            //             setUserAddressForm(addressform)
            //         }
            //     } catch (error) {
            //         console.error(error.message)
            //     }
            // }
            // getUserInfo()
        }
        , [])

    useEffect(
        () => {
            async function getUserOrder() {
                try {
                    if (authContext.isAuthenticated) {
                        const token = 'Bearer ' + localStorage.getItem("token")
                        const response = await axios.get(PATH.API_ROOT_URL + PATH.API_ORDER + "/order/user", {
                            headers: {
                                'Authorization': token
                            }
                        });
                        console.log(response.data)
                        setOrders(response.data)
                        // const tempcart = [];
                        // response.data.cartItemDtos.forEach(item => {
                        //   tempcart.push({
                        //     productCode: item.productDto.code,
                        //     productInventory: item.inventoryItem.sku,
                        //     units: item.units
                        //   })
                        // });
                        // setCartForm(tempcart)

                        // console.log(tempcart)
                    }
                } catch (error) {
                    console.error(error.message)
                }
            }
            getUserOrder()
        }
        , [authContext.isAuthenticated])


    const handleCancel = async (code) =>{
        try {
            await axios.post(PATH.API_ROOT_URL + PATH.API_ORDER + "/order/change-status/"+ code, {}, {
              params: {status: "canceled"},  
              headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem("token")
              }
          });
          
          alert("Huy?? ????n ha??ng tha??nh c??ng")
          } catch (error) {
            console.log(error)
          }
    }    
    return (

        <div className="page-wrapper">

            <main className="main">
                <div className="page-header text-center" style={{ backgroundImage: 'url("assets/images/page-header-bg.jpg")' }}>
                    <div className="container">
                        <h1 className="page-title">T??i kho???n c???a t??i<span></span></h1>
                    </div>{/* End .container */}
                </div>{/* End .page-header */}
                <nav aria-label="breadcrumb" className="breadcrumb-nav mb-3">
                    <div className="container">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><NavLink to={"/"}>Trang ch???</NavLink></li>
                            <li className="breadcrumb-item active" aria-current="page">T??i kho???n</li>
                        </ol>
                    </div>{/* End .container */}
                </nav>{/* End .breadcrumb-nav */}
                <div className="page-content">
                    <div className="dashboard">
                        <div className="container">
                            <div className="row">
                                <aside className="col-md-4 col-lg-3">
                                    <ul className="nav nav-dashboard flex-column mb-3 mb-md-0" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link active" id="tab-dashboard-link" data-toggle="tab" href="#tab-dashboard" role="tab" aria-controls="tab-dashboard" aria-selected="true">Th??ng tin t??i kho???n</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" id="tab-orders-link" data-toggle="tab" href="#tab-orders" role="tab" aria-controls="tab-orders" aria-selected="false">????n h??ng</a>
                                        </li>

                                        <li className="nav-item">
                                            <a className="nav-link" id="tab-account-link" data-toggle="tab" href="#tab-account" role="tab" aria-controls="tab-account" aria-selected="false">Th??ng tin nh???n h??ng</a>
                                        </li>
                                        <li className="nav-item">
                                            {/* <a className="nav-link" href="#" onClick={keycloak.logout}>????ng xu???t</a> */}
                                        </li>
                                    </ul>
                                </aside>{/* End .col-lg-3 */}
                                <div className="col-md-8 col-lg-9">
                                    <div className="tab-content">
                                        <div className="tab-pane fade show active" id="tab-dashboard" role="tabpanel" aria-labelledby="tab-dashboard-link">
                                            {/* <p>Xin ch??o <span className="font-weight-normal text-dark">{keycloak.tokenParsed.name}!</span> (kh??ng ph???i <span className="font-weight-normal text-dark">{keycloak.tokenParsed.name}!</span>? <a href="#" onClick={keycloak.logout}>????ng xu???t</a>) */}
                                                <br />
                                                {/* Thay ?????i th??ng tin ????ng nh???p <a href="#" onClick={keycloak.accountManagement}>t???i ????y</a>.</p> */}
                                        </div>{/* .End .tab-pane */}
                                        <div className="tab-pane fade" id="tab-orders" role="tabpanel" aria-labelledby="tab-orders-link">
                                            {orders.length > 0 ? <div>
                                                <div className="accordion" id="accordion-1">
                                                    {orders.map((item, index) => (
                                                        <div className="card">
                                                            <div className="card-header" id={index}>
                                                                <p className="card-title">
                                                                    <a role="button" data-toggle="collapse" href={"#collapse-" + index} aria-expanded="true" aria-controls={"collapse-" + index}>
                                                                        ????n h??ng #{item.code}
                                                                    </a>
                                                                </p>
                                                            </div>{/* End .card-header */}
                                                            <div id={"collapse-" + index} className="collapse" aria-labelledby={index} data-parent="#accordion-1">
                                                                <div className="card-body">
                                                                    <p>
                                                                        H??? t??n ng?????i nh???n: {item.name}
                                                                        <br></br>?????a ch??? giao h??ng: {item.address}
                                                                        <br></br>S??? ??i???n tho???i: {item.phoneNumber}
                                                                        <br></br>?????a ch??? email: {item.email}
                                                                        <br></br>Ph????ng th???c thanh to??n: {item.paymentMethod}
                                                                        <br></br>Ghi ch??: {item.note}
                                                                        <br></br>Tr???ng th??i: {item.status}
                                                                    </p>
                                                                    <table className="table table-cart table-mobile">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>S???n ph???m</th>
                                                                                <th>Gi??</th>
                                                                                <th>S??? l?????ng</th>
                                                                                <th>T???ng c???ng</th>
                                                                                <th />
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {item?.cartItems?.map((product, index) => (
                                                                                <tr>
                                                                                    <td className="product-col">
                                                                                        <div className="product">
                                                                                            <figure className="product-media">
                                                                                                <NavLink to={"/product/" + product.productDto.code} >
                                                                                                    <img src={product.productDto.mediaList[0].imgUrl} alt={product.productDto.mediaList[0].altText} />
                                                                                                </NavLink>
                                                                                            </figure>
                                                                                            <h3 className="product-title">
                                                                                                <NavLink to={"/product/" + product.productDto.code} >{product.productDto.name + " " + product.inventoryItem.productAttributeValues.reduce((string, current) => string += current.attributeValue + " ", "")}</NavLink>
                                                                                            </h3>{/* End .product-title */}
                                                                                        </div>{/* End .product */}
                                                                                    </td>
                                                                                    <td className="price-col">{product.inventoryItem.retailPrice} VN??</td>
                                                                                    <td className="quantity-col">
                                                                                        {product.units}
                                                                                    </td>
                                                                                    <td className="total-col">{product.inventoryItem.retailPrice * product.units} VN??</td>
                                                                                </tr>))}
                                                                        </tbody>
                                                                    </table>
                                                                    <div className="cart-bottom">
                                                                    {item.status === "delivered"?<div></div>:<button type="button" className="btn btn-outline-dark-2" onClick={() => handleCancel(item.code)}><span>Hu??? ????n h??ng</span></button>}
                </div>
                                                                </div>{/* End .card-body */}
                                                            </div>{/* End .collapse */}
                                                        </div>
                                                    ))}
                                                </div>

                                            </div> : <div><p>B???n ch??a ?????t ????n h??ng n??o.</p>
                                                <NavLink to={"/"} className="btn btn-outline-primary-2"><span>?????T H??NG</span><i className="icon-long-arrow-right" /></NavLink></div>}
                                        </div>{/* .End .tab-pane */}

                                        <div className="tab-pane fade" id="tab-address" role="tabpanel" aria-labelledby="tab-address-link">
                                            <p>?????a ch??? b??n d?????i s??? ???????c s??? d???ng .</p>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="card card-dashboard">
                                                        <div className="card-body">
                                                            <h3 className="card-title">Billing Address</h3>{/* End .card-title */}
                                                            <p>User Name<br />
                                                                User Company<br />
                                                                John str<br />
                                                                New York, NY 10001<br />
                                                                1-234-987-6543<br />
                                                                yourmail@mail.com<br />
                                                                <a href="#">Edit <i className="icon-edit" /></a></p>
                                                        </div>{/* End .card-body */}
                                                    </div>{/* End .card-dashboard */}
                                                </div>{/* End .col-lg-6 */}
                                                <div className="col-lg-6">
                                                    <div className="card card-dashboard">
                                                        <div className="card-body">
                                                            <h3 className="card-title">Shipping Address</h3>{/* End .card-title */}
                                                            <p>You have not set up this type of address yet.<br />
                                                                <a href="#">Edit <i className="icon-edit" /></a></p>
                                                        </div>{/* End .card-body */}
                                                    </div>{/* End .card-dashboard */}
                                                </div>{/* End .col-lg-6 */}
                                            </div>{/* End .row */}
                                        </div>{/* .End .tab-pane */}
                                        <div className="tab-pane fade" id="tab-account" role="tabpanel" aria-labelledby="tab-account-link">
                                        <form onSubmit={() => submitForm()}>
                                            <div className="row">
                                            <div className="col-lg-9">
                                                <h2 className="checkout-title">Th??ng tin nh???n h??ng</h2>{/* End .checkout-title */}
                                                <label>H??? t??n ng?????i nh???n h??ng *</label>
                                                <input type="text" className="form-control" placeholder="H??? t??n" required value={userAddressForm.name} onChange={handleNameInputChange}/>
                                                <label>?????a ch??? *</label>
                                                <input type="text" className="form-control" placeholder="S??? nh??, t??n ???????ng" required value={userAddressForm.address} onChange={handleAddressInputChange}/>
                                                <div className="row">
                                                <div className="col-sm-6">
                                                    <label>T???nh / Th??nh Ph??? *</label>
                                                    <input type="text" className="form-control" required value={userAddressForm.city} onChange={handleCityInputChange}/>
                                                </div>{/* End .col-sm-6 */}
                                                <div className="col-sm-6">
                                                    <label>Qu???n / Th??? X??*</label>
                                                    <input type="text" className="form-control" required value={userAddressForm.district} onChange={handleDistricInputChange}/>
                                                </div>{/* End .col-sm-6 */}
                                                </div>{/* End .row */}
                                                <div className="row">
                                                <div className="col-sm-6">
                                                    <label>M?? ZIP *</label>
                                                    <input type="text" className="form-control" required value={userAddressForm.zipcode} onChange={handleZipCodeInputChange}/>
                                                </div>{/* End .col-sm-6 */}
                                                <div className="col-sm-6">
                                                    <label>S??? ??i???n tho???i *</label>
                                                    <input type="tel" className="form-control" required value={userAddressForm.phoneNumber} onChange={handlePhoneNumberInputChange}/>
                                                </div>{/* End .col-sm-6 */}
                                                </div>{/* End .row */}
                                                <label>?????a ch??? email *</label>
                                                <input type="email" className="form-control" required value={userAddressForm.email} onChange={handleEmailInputChange}/>                                           
                                            </div>{/* End .col-lg-9 */}                                           
                                            </div>{/* End .row */}
                                            <button type="submit" className="btn btn-outline-primary-2">
			                					<span>L??u thay ?????i</span>
			            						<i className="icon-long-arrow-right"></i>
			                				</button>
                                        </form>
                                        </div>{/* .End .tab-pane */}
                                    </div>
                                </div>{/* End .col-lg-9 */}
                            </div>{/* End .row */}
                        </div>{/* End .container */}
                    </div>{/* End .dashboard */}
                </div>{/* End .page-content */}
            </main>{/* End .main */}
        </div>
    );
}
export default Dashboard