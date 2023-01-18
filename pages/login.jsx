import { Tabs, TabList, Tab, TabPanel } from "react-tabs";

import ALink from "~/components/features/alink";
import React, { useState, useEffect } from "react";
import { AvForm, AvField } from "availity-reactstrap-validation";

import { Row, Col, Label } from "reactstrap";
import { postSubmitForm, getGeoInfo } from "~/helpers/forms_helper";
import { toast } from "react-toastify";
import store from "store";

function Login() {
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

  const [isLoginOTP, setIsLoginOTP] = useState(null);
  const [isLoginPassword, setIsLoginPassword] = useState(false);
  const [mobileEmail, setMobileEmail] = useState(null);

  const [isRegisterOTP, setIsRegisterOTP] = useState(null);
  const [register, setRegister] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(store.get("user") ? store.get("user") : null);
  }, []);
  const handleRegister = async (e, v) => {
    const geo_response = await getGeoInfo();
    let url = process.env.NEXT_PUBLIC_SERVER_URL + "/customers/getotp";

    const response = await postSubmitForm(url, {
      mobile: v.mobile,
      email: v.email,
      country: geo_response.country_name,
    });
    if (response && response.status === 1) {
      setRegister({
        name: v.name,
        mobile: v.mobile,
        email: v.email,
        pwd: v.pwd,
      });
      setIsRegisterOTP(response.data.otp);
      startOtpTimer("register");
    }
  };

  const handleRegisterOTP = async (e, v) => {
    if (isRegisterOTP == v.otp) {
      let url = process.env.NEXT_PUBLIC_SERVER_URL + "/customers/register";
      const response = await postSubmitForm(url, register);
      if (response && response.status === 1) {
        store.set("user", response.data);
        setUser(store.get("user") ? store.get("user") : null);

        setRegister({});
        setIsRegisterOTP(null);
        toast.success("Registration Successful.");
      } else {
        toast.error(response.message);
      }
    } else {
      toast.error("Invalid OTP");
    }
  };

  const handleLogin = async (e, v) => {
    setMobileEmail(v.mobile_email);
    if (!isNaN(v.mobile_email)) {
      const geo_response = await getGeoInfo();
      let url =
        process.env.NEXT_PUBLIC_SERVER_URL + "/customers/checkmobilelogin";

      const response = await postSubmitForm(url, {
        mobile: v.mobile_email,
        country: geo_response.country_name,
      });
      if (response && response.status === 1) {
        setIsLoginOTP(response.data.otp);
        startOtpTimer("login");
      } else {
        toast.error(response.message);
      }
    } else {
      let url =
        process.env.NEXT_PUBLIC_SERVER_URL + "/customers/checkemaillogin";
      const response = await postSubmitForm(url, {
        email: v.mobile_email,
      });
      if (response && response.status === 1) {
        setIsLoginPassword(true);
      } else {
        toast.error(response.message);
      }
    }
  };

  const handleLoginMobile = async (e, v) => {
    if (isLoginOTP == v.otp) {
      let url = process.env.NEXT_PUBLIC_SERVER_URL + "/customers/loginmobile";
      const response = await postSubmitForm(url, { mobile: mobileEmail });
      if (response && response.status === 1) {
        store.set("user", response.data);
        setUser(store.get("user") ? store.get("user") : null);

        setMobileEmail(null);
        setIsLoginOTP(null);
        toast.success("Login Successful.");
        window.location.reload();
      }
    } else {
      toast.error("Invalid OTP");
    }
  };

  const handleLoginPassword = async (e, v) => {
    //console.log(mobileEmail, v.pwd);
    let url = process.env.NEXT_PUBLIC_SERVER_URL + "/customers/loginemail";
    const response = await postSubmitForm(url, {
      email: mobileEmail,
      pwd: v.pwd,
    });
    if (response && response.status === 1) {
      store.set("user", response.data);
      setUser(store.get("user") ? store.get("user") : null);

      setMobileEmail(null);
      setIsLoginOTP(null);
      toast.success("Login Successful.");
      window.location.reload();
    } else {
      toast.error(response.message);
    }
  };

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
    <div className="main">
      <nav className="breadcrumb-nav border-0 mb-0">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <ALink href="/">Home</ALink>
            </li>

            <li className="breadcrumb-item active">Login</li>
          </ol>
        </div>
      </nav>

      <div
        className="login-page bg-image pt-8 pb-8 pt-md-12 pb-md-12 pt-lg-17 pb-lg-17"
        style={{ backgroundImage: `url(images/backgrounds/login-bg.jpg)` }}
      >
        <div className="container">
          <div className="form-box">
            <div className="form-tab">
              {user ? (
                <>
                  <span style={{ fontSize: "18px" }}>
                    Welcome<strong> {user.name}</strong>
                  </span>
                  <br />
                  <ALink
                    href="/shop/sidebar/3cols"
                    className="btn btn-outline-primary-2"
                  >
                    <span>GO SHOP</span>
                    <i className="icon-long-arrow-right"></i>
                  </ALink>
                </>
              ) : (
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
                            <AvForm onValidSubmit={handleLogin}>
                              <Row>
                                <Col lg={12}>
                                  <AvField
                                    name="mobile_email"
                                    label={"Mobile or Email *"}
                                    type="text"
                                    maxLength="60"
                                    validate={{
                                      required: { value: true },
                                    }}
                                    errorMessage={
                                      "Mobile / Email cannot be empty"
                                    }
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
                      {isLoginOTP && (
                        <Row>
                          <Col>
                            <AvForm onValidSubmit={handleLoginMobile}>
                              <Row>
                                <Col lg={12}>
                                  <AvField
                                    name="otp"
                                    label={"OTP *"}
                                    type="text"
                                    maxLength={6}
                                    validate={{
                                      required: { value: true },
                                    }}
                                    errorMessage={"OTP cannot be empty"}
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

                                    {isOtpTimer ? (
                                      <Label
                                        className="forgot-link"
                                        style={{
                                          color: "#a6c76c",
                                        }}
                                      >
                                        Resend OTP in{" "}
                                        <span
                                          id="loginOtpTimer"
                                          style={{
                                            color: "green",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          60
                                        </span>
                                      </Label>
                                    ) : (
                                      <Label
                                        className="forgot-link"
                                        style={{
                                          cursor: "pointer",
                                          color: "#a6c76c",
                                        }}
                                        onClick={handleResendLoginOTP}
                                      >
                                        Resend OTP
                                      </Label>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            </AvForm>
                          </Col>
                        </Row>
                      )}
                      {isLoginPassword && (
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
                      )}
                    </TabPanel>

                    <TabPanel>
                      {!isRegisterOTP && (
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
                                        errorMessage: "Mobile cannot be empty.",
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
                      )}
                      {isRegisterOTP && (
                        <Row>
                          <Col>
                            <AvForm onValidSubmit={handleRegisterOTP}>
                              <Row>
                                <Col lg={12}>
                                  <AvField
                                    name="otp"
                                    label={"Enter OTP *"}
                                    type="text"
                                    maxLength={6}
                                    validate={{ required: { value: true } }}
                                    errorMessage={"This field cannot be empty"}
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

                                    {isOtpTimer ? (
                                      <Label
                                        className="forgot-link"
                                        style={{
                                          color: "#a6c76c",
                                        }}
                                      >
                                        Resend OTP in{" "}
                                        <span
                                          id="registerOtpTimer"
                                          style={{
                                            color: "green",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          60
                                        </span>
                                      </Label>
                                    ) : (
                                      <Label
                                        className="forgot-link"
                                        style={{
                                          cursor: "pointer",
                                          color: "#a6c76c",
                                        }}
                                        onClick={handleResendRegisterOTP}
                                      >
                                        Resend OTP
                                      </Label>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            </AvForm>
                          </Col>
                        </Row>
                      )}
                    </TabPanel>
                  </div>
                </Tabs>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
