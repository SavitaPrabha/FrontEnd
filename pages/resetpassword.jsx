import React, { useEffect, useState } from "react";
import ALink from "~/components/features/alink";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { Row, Col, Label, Button } from "reactstrap";
import { toast } from "react-toastify";
import { postSubmitForm } from "~/helpers/forms_helper";

function ResetPassword() {
  const [id, setId] = useState();
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  useEffect(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("id")) {
      setId(urlParams.get("id"));
    }
  }, []);
  const handleResetPassword = async (e, v) => {
    if (!id) {
      toast.error("Invalid request.");
    } else if (v.new_password !== v.confirm_new_password) {
      toast.error("Confirm password did not match.");
    } else {
      let url = process.env.NEXT_PUBLIC_SERVER_URL + "/customers/resetpassword";
      console.log(id, v.new_password);
      const response = await postSubmitForm(url, {
        id: id,
        pwd: v.new_password,
      });
      if (response && response.status === 1) {
        toast.success("Password updated successfully.");
        setIsPasswordUpdated(true);
      } else {
        toast.error(response.message);
      }
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

            <li className="breadcrumb-item active">Reset Password</li>
          </ol>
        </div>
      </nav>

      <div
        className="error-content text-center position-relative"
        style={{
          backgroundImage: `url(images/backgrounds/error-bg.jpg)`,
          marginBottom: "-1px",
        }}
      >
        <div className="container">
          {isPasswordUpdated ? (
            <>
              <h3 className="error-title">Password updated successfully.</h3>

              <ALink
                href="/login"
                className="btn btn-outline-primary-2 btn-minwidth-lg"
              >
                <span>GOTO LOGIN</span>
                <i className="icon-long-arrow-right"></i>
              </ALink>
            </>
          ) : id ? (
            <>
              <h3>Reset Password</h3>
              <AvForm onValidSubmit={handleResetPassword}>
                <Row>
                  <Col lg={2}></Col>
                  <Col lg={4}>
                    <AvField
                      name="new_password"
                      label={"New Password"}
                      type="password"
                      validate={{
                        required: { value: true },
                      }}
                      errorMessage={"New password cannot be empty"}
                    />
                  </Col>
                  <Col lg={4}>
                    <AvField
                      name="confirm_new_password"
                      label={"Confirm New Password"}
                      type="password"
                      validate={{
                        required: { value: true },
                      }}
                      errorMessage={"Confirm new password cannot be empty"}
                    />
                  </Col>
                  <Col lg={2}></Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <Button className="btn-btn-primary">Submit</Button>
                  </Col>
                </Row>
              </AvForm>
            </>
          ) : (
            <>
              <h1 className="error-title">Error 404</h1>

              <p>We are sorry, the page you've requested is not available.</p>
              <ALink
                href="/"
                className="btn btn-outline-primary-2 btn-minwidth-lg"
              >
                <span>BACK TO HOMEPAGE</span>
                <i className="icon-long-arrow-right"></i>
              </ALink>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ResetPassword);
