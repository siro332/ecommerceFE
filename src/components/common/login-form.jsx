import React, { useState, useContext } from "react";
import { Route, Redirect, useNavigate} from "react-router-dom";
import axios from "axios";
import { PATH } from "../../constants/API";
import { AuthContext } from "../helpers/context/auth-context";
function LoginForm(){
    const authContext = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameRegister, setUsernameRegister] = useState("");
    const [passwordRegister, setPasswordRegister] = useState("");
    const navigate = useNavigate();
    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(  PATH.API_ROOT_URL + PATH.API_AUTH_LOGIN + "/authenticate", {
            email: username,
            password: password
          })
          const data = response.data;
          console.log(data) 
          if (data != null) {
            (authContext.login)(data)
            console.log(authContext.isAuthenticated)
            window.location.reload(false);
          }
        } catch (error) {
          console.error(error);
        }
      };
    
      const handleSubmitRegister = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(  PATH.API_ROOT_URL + PATH.API_AUTH_LOGIN + "/register", {
            email: username,
            password: password
          })
          const data = response.data;
          if (data != null) {
            (authContext.login)()
            window.location.reload(false);
          }
        } catch (error) {
          console.error(error);
        }
      };
    return(
        <div className="modal fade" id="signin-modal" tabIndex={-1} role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
                <div className="modal-body">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i className="icon-close" /></span>
                    </button>
                    <div className="form-box">
                        <div className="form-tab">
                            <ul className="nav nav-pills nav-fill nav-border-anim" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="signin-tab" data-toggle="tab" href="#signin" role="tab" aria-controls="signin" aria-selected="true">Sign In</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="register-tab" data-toggle="tab" href="#register" role="tab" aria-controls="register" aria-selected="false">Register</a>
                                </li>
                            </ul>
                            <div className="tab-content" id="tab-content-5">
                                <div className="tab-pane fade show active" id="signin" role="tabpanel" aria-labelledby="signin-tab">
                                    <form onSubmit={handleSubmitLogin}>
                                        <div className="form-group">
                                            <label htmlFor="singin-email">Tên tài khoản hoặc email *</label>
                                            <input type="text" className="form-control" id="singin-email" name="singin-email" required 
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                        </div>{/* End .form-group */}
                                        <div className="form-group">
                                            <label htmlFor="singin-password">Mật khẩu *</label>
                                            <input type="password" className="form-control" id="singin-password" name="singin-password" required 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>{/* End .form-group */}
                                        <div className="form-footer">
                                            <button type="submit" className="btn btn-outline-primary-2">
                                                <span>Đăng nhập</span>
                                                <i className="icon-long-arrow-right" />
                                            </button>
                                        </div>{/* End .form-footer */}
                                    </form>                                   
                                </div>{/* .End .tab-pane */}
                                <div className="tab-pane fade" id="register" role="tabpanel" aria-labelledby="register-tab">
                                    <form onSubmit={handleSubmitRegister}>
                                        <div className="form-group">
                                            <label htmlFor="register-email">Nhập email của bạn *</label>
                                            <input type="email" className="form-control" id="register-email" name="register-email" required 
                                                value={usernameRegister}
                                                onChange={(e) => setUsernameRegister(e.target.value)}
                                            />
                                        </div>{/* End .form-group */}
                                        <div className="form-group">
                                            <label htmlFor="register-password">Nhập mật khẩu *</label>
                                            <input type="password" className="form-control" id="register-password" name="register-password" required 
                                                value={passwordRegister}
                                                onChange={(e) => setPasswordRegister(e.target.value)}
                                            />
                                        </div>{/* End .form-group */}
                                        <div className="form-footer">
                                            <button type="submit" className="btn btn-outline-primary-2">
                                                <span>Đăng ký</span>
                                                <i className="icon-long-arrow-right" />
                                            </button>
                                            <div className="custom-control custom-checkbox">
                                                <input type="checkbox" className="custom-control-input" id="register-policy" required />
                                                <label className="custom-control-label" htmlFor="register-policy">Tôi đồng ý với <a href="#">điều khoản sử dụng</a> *</label>
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
    );
}
export default LoginForm;