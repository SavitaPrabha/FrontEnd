import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";

import { AvForm, AvField } from "availity-reactstrap-validation";

import ALink from "~/components/features/alink";

import { Row, Col, Label } from "reactstrap";
import { postSubmitForm, getGeoInfo, postSubmitFormNoAuth } from "~/helpers/forms_helper";
import { toast } from "react-toastify";
import store from "store";
import { isNumberValue } from "apollo-utilities";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(77,77,77,0.6)",
    zIndex: "9000",
  },
};

Modal.setAppElement("body");

function LoginModal() {
  const [isOtpTimer, setIsOtpTimer] = useState(false);

  const startOtpTimer = (timer_type) => {
    let otpTimer = 60;
    setIsOtpTimer(true);
    const otp = setInterval(() => {
      if (otpTimer <= 0) {
        clearInterval(otp);
        setIsOtpTimer(false);
      } else {
        otpTimer -= 1;
        if (timer_type == "login") {
          const elem = document.getElementById("loginOtpTimer");
          if (elem) elem.innerText = otpTimer;
        } else if (timer_type == "register") {
          const elem = document.getElementById("registerOtpTimer");
          if (elem) elem.innerText = otpTimer;
        }
      }
    }, 1000);
  };

  const [open, setOpen] = useState(false);

  const [isLoginOTP, setIsLoginOTP] = useState(null);
  const [isLoginPassword, setIsLoginPassword] = useState(false);
  const [mobileEmail, setMobileEmail] = useState(null);

  const [isRegisterOTP, setIsRegisterOTP] = useState(null);
  const [register, setRegister] = useState({});
  const [user, setUser] = useState(null);
  let timer;

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  });

  useEffect(() => {
    setUser(store.get("user") ? store.get("user") : null);
  }, []);

  const handleRegister = async (e, v) => {
    let url = process.env.NEXT_PUBLIC_SERVER_URL + "/customers/register";

    const response = await postSubmitForm(url, {
      mobile: v.mobile,
      email: v.email,
      name:v.name,
      pwd:v.pwd
      
    });
    if (response && response.status === 1) {
      store.set("user", response.data);
      setUser(store.get("user") ? store.get("user") : null);
      setOpen(false);
 
      toast.success(response.message);
      window.location.reload();
    } else {
      toast.error(response.message);
    }
  };

  // const handleRegisterOTP = async (e, v) => {
  //   if (isRegisterOTP == v.otp) {
  //     let url = process.env.NEXT_PUBLIC_SERVER_URL + "/customers/register";
  //     const response = await postSubmitForm(url, register);
  //     if (response && response.status === 1) {
  //       store.set("user", response.data);
  //       setUser(store.get("user") ? store.get("user") : null);
  //       setOpen(false);
  //       setRegister({});
  //       setIsRegisterOTP(null);
  //       toast.success("Registration Successful.");
  //     } else {
  //       toast.error(response.message);
  //     }
  //   } else {
  //     toast.error("Invalid OTP");
  //   }
  // };

  // const handleLogin = async (e, v) => {
  //   setMobileEmail(v.mobile_email);
   
  //     let url =
  //       process.env.NEXT_PUBLIC_SERVER_URL + "/customers/checkemaillogin";
  //     const response = await postSubmitForm(url, {
  //       email: v.mobile_email,
  //     });
  //     if (response && response.status === 1) {
  //       setIsLoginPassword(true);
  //     } else {
  //       toast.error(response.message);
  //     }
    
  // };

  // const handleLoginMobile = async (e, v) => {
  //   if (isLoginOTP == v.otp) {
  //     let url = process.env.NEXT_PUBLIC_SERVER_URL + "/customers/loginmobile";
  //     const response = await postSubmitForm(url, { mobile: mobileEmail });
  //     if (response && response.status === 1) {
  //       store.set("user", response.data);

  //       setUser(store.get("user") ? store.get("user") : null);
  //       setOpen(false);
  //       setMobileEmail(null);
  //       setIsLoginOTP(null);
  //       toast.success("Login Successful.");
  //       window.location.reload();
  //     }
  //   } else {
  //     toast.error("Invalid OTP");
  //   }
  // };

  const handleLoginPassword = async (e, v) => {
    let url = process.env.NEXT_PUBLIC_SERVER_URL +"/customers/login";
    const response = await postSubmitFormNoAuth(url, {
      email: v.email,
      pwd: v.pwd,
    });
    if (response && response.status === 1) {
      store.set("user", response.data);
      setUser(store.get("user") ? store.get("user") : null);
      setOpen(false);
    
      toast.success("Login Successful.");
      window.location.reload();
    } else {
      toast.error(response.message);
    }
  };

  function closeModal() {
    document
      .getElementById("login-modal")
      .classList.remove("ReactModal__Content--after-open");

    if (document.querySelector(".ReactModal__Overlay")) {
      document.querySelector(".ReactModal__Overlay").style.opacity = "0";
    }

    timer = setTimeout(() => {
      setOpen(false);
    }, 350);
  }

  function openModal(e) {
    e.preventDefault();
    setOpen(true);
  }

  const handleResendLoginOTP = async (e, v) => {
    const geo_response = await getGeoInfo();

    let url =
      process.env.NEXT_PUBLIC_SERVER_URL + "/customers/checkmobilelogin";

    const response = await postSubmitForm(url, {
      mobile: mobileEmail,
      country: geo_response.country_name,
    });
    if (response && response.status === 1) {
      setIsLoginOTP(response.data.otp);

      startOtpTimer("login");
      toast.success("OTP resent successfully.");
    } else {
      toast.error(response.message);
    }
  };

  const handleResendRegisterOTP = async (e, v) => {
    const geo_response = await getGeoInfo();

    let url = process.env.NEXT_PUBLIC_SERVER_URL + "/customers/getotp";

    const response = await postSubmitForm(url, {
      mobile: register.mobile,
      email: register.email,
      country: geo_response.country_name,
    });
    if (response && response.status === 1) {
      setIsRegisterOTP(response.data.otp);
      startOtpTimer("register");
      toast.success("OTP resent successfully.");
    }
  };

  const handleForgotPassword = async () => {
    console.log(mobileEmail);
    let url = process.env.NEXT_PUBLIC_SERVER_URL + "/customers/forgotpassword";

    const response = await postSubmitForm(url, {
      email: mobileEmail,
    });
    if (response && response.status === 1) {
      toast.success("Reset password email is sent successfully.");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <li>
      {user ? (
        <>Welcome, {user.name} </>
      ) : (
        <a href="#" onClick={openModal}>
          Sign In/ Register
        </a>
      )}
      {open ? (
        <Modal
          isOpen={open}
          style={customStyles}
          contentLabel="login Modal"
          className="modal-dialog"
          overlayClassName="d-flex align-items-center justify-content-center"
          id="login-modal"
          onRequestClose={closeModal}
          closeTimeoutMS={10}
        >
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="close" onClick={closeModal}>
                <span aria-hidden="true">
                  <i className="icon-close"></i>
                </span>
              </button>
              <div className="form-box">
                <div className="form-tab">
                  <Tabs selectedTabClassName="show" defaultIndex={0}>
                    <TabList className="nav nav-pills nav-fill">
                      <Tab className="nav-item">
                        <span className="nav-link">Sign In</span>
                      </Tab>

                      <Tab className="nav-item">
                        <span className="nav-link">Register</span>
                      </Tab>
                    </TabList>

                    <div className="tab-content">
                      <TabPanel style={{ paddingTop: "2rem" }}>
                        {!isLoginOTP && !isLoginPassword && (
                          <Row>
                            <Col>
                              <AvForm onValidSubmit={handleLoginPassword}>
                                <Row>
                                  <Col lg={12}>
                                    <AvField
                                      name="email"
                                      label={" Email *"}
                                      type="email"
                                      validate={{
                                        required: { value: true },
                                      }}
                                      errorMessage={
                                        "Mobile / Email cannot be empty"
                                      }
                                    />
                                  </Col>
                                  <Col lg={12}>
                                    <AvField
                                      name="pwd"
                                      label={"Password *"}
                                      type="password"
                                      validate={{
                                        required: { value: true },
                                      }}
                                      errorMessage={"Password cannot be empty"}
                                    />
                                  </Col>
                                  <Col lg={12}>
                                    <div className="form-footer">
                                      <button
                                        type="submit"
                                        className="btn btn-outline-primary-2"
                                      >
                                        <span>LOG IN</span>
                                        <i className="icon-long-arrow-right"></i>
                                      </button>
                                    </div>
                                  </Col>
                                </Row>
                              </AvForm>
                            </Col>
                          </Row>
                        )}
                
                        {/* {isLoginPassword && (
                          <Row>
                            <Col>
                              <AvForm onValidSubmit={handleLoginPassword}>
                                <Row>
                                  <Col lg={12}>
                                    <AvField
                                      name="pwd"
                                      label={"Password *"}
                                      type="password"
                                      validate={{
                                        required: { value: true },
                                      }}
                                      errorMessage={"Password cannot be empty"}
                                    />
                                  </Col>

                                  <Col lg={12}>
                                    <div className="form-footer">
                                      <button
                                        type="submit"
                                        className="btn btn-outline-primary-2"
                                      >
                                        <span>SUBMIT</span>
                                        <i className="icon-long-arrow-right"></i>
                                      </button>

                                      <Label
                                        className="forgot-link"
                                        style={{
                                          cursor: "pointer",
                                          color: "#a6c76c",
                                        }}
                                        onClick={handleForgotPassword}
                                      >
                                        Forgot Password?
                                      </Label>
                                    </div>
                                  </Col>
                                </Row>
                              </AvForm>
                            </Col>
                          </Row>
                        )} */}
                      </TabPanel>

                      <TabPanel>
                        
                          <Row>
                            <Col>
                              <AvForm onValidSubmit={handleRegister}>
                                <Row>
                                  <Col lg={12}>
                                    <AvField
                                      name="name"
                                      label={"Name *"}
                                      type="text"
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage: "Name cannot be empty.",
                                        },
                                      }}
                                    />
                                  </Col>
                                  <Col lg={12}>
                                    <AvField
                                      name="mobile"
                                      label={"Mobile *"}
                                      type="text"
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "Mobile cannot be empty.",
                                        },
                                        number: {
                                          value: true,
                                          errorMessage:
                                            "Mobile should be a number.",
                                        },
                                        minLength: {
                                          value: 10,
                                          errorMessage:
                                            "Mobile should be of 10 digits.",
                                        },
                                        maxLength: {
                                          value: 15,
                                          errorMessage:
                                            "Mobile should be of 10 digits.",
                                        },
                                      }}
                                    />
                                  </Col>
                                  <Col lg={12}>
                                    <AvField
                                      name="email"
                                      label={"Email"}
                                      type="email"
                                      errorMessage="Invalid email format."
                                    />
                                  </Col>
                                  <Col lg={12}>
                                    <AvField
                                      name="pwd"
                                      label={"Password *"}
                                      type="password"
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "Password cannot be empty.",
                                        },
                                      }}
                                    />
                                  </Col>
                                  <Col lg={12}>
                                    <div className="form-footer">
                                      <button
                                        type="submit"
                                        className="btn btn-outline-primary-2"
                                      >
                                        <span>SIGN UP</span>
                                        <i className="icon-long-arrow-right"></i>
                                      </button>
                                      {/* 
                                      <div className="custom-control custom-checkbox">
                                        <input
                                          type="checkbox"
                                          className="custom-control-input"
                                          id="register-policy-2"
                                          required
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="register-policy-2"
                                        >
                                          I agree to the privacy policy *
                                        </label>
                                      </div> */}
                                    </div>
                                  </Col>
                                </Row>
                              </AvForm>
                            </Col>
                          </Row>
                        
                       
                      </TabPanel>
                    </div>
                  </Tabs>
                </div>
                <div>
                  By signing in or registering, you agree to our{" "}
                  <a
                    href="https://grvfurniture.com/privacypolicy"
                    target="_blank"
                  >
                    Privacy Policy
                  </a>
                  .
                </div>
              </div>
            </div>
          </div>
        </Modal>
      ) : (
        ""
      )}
    </li>
  );
}

export default LoginModal;
