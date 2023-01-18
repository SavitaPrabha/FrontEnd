import React, { useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Modal from "react-modal";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
// { toast } from 'react-toastify';
const customStyles = {
  overlay: {
    backgroundColor: "rgba(51,51,51,0.6)",
    zIndex: "9001",
  },
};
import { postSubmitForm } from "~/helpers/forms_helper";
Modal.setAppElement("body");

function NewsletterModal() {
  const [open, setOpen] = useState(false);
  const [doNotShow, setDoNotShow] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState();
  const [subscriberMobile, setSubscriberMobile] = useState();
  const [subscriberMessage, setSubscriberMessage] = useState();
  useEffect(() => {
    let timer;
    Cookie.get(`hideNewsletter-${process.env.NEXT_PUBLIC_DEMO}`) ||
      (timer = setTimeout(() => {
        setOpen(true);
      }, 1000));

    return () => {
      timer && clearTimeout(timer);
    };
  }, []);

  function closeModal(e) {
    document
      .getElementById("newsletter-popup-form")
      .classList.remove("ReactModal__Content--after-open");

    if (document.querySelector(".ReactModal__Overlay")) {
      document.querySelector(".ReactModal__Overlay").style.opacity = "0";
    }

    setTimeout(() => {
      setOpen(false);
      doNotShow &&
        Cookie.set(`hideNewsletter-${process.env.NEXT_PUBLIC_DEMO}`, "true", {
          expires: 7,
        });
    }, 350);
  }
  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateMobile = (mobile) => {
    var re = new RegExp("^[0-9]{10}$");
    console.log(re.test(mobile));
  
    return re.test(mobile);
  };

  function handleChange(e) {
    setDoNotShow(e.target.checked);
  }
  const handleSubscribe = async (e, v) => {
    e.preventDefault();
    if (validateEmail(subscriberEmail)) {
      let url = process.env.NEXT_PUBLIC_SERVER_URL + "/subscribers/subscribe";
      const response = await postSubmitForm(url, {
        email: subscriberEmail,
        mobile: subscriberMobile,
        name: subscriberMessage,
      });

      if (response && response.status === 1) {
        toast.success("Subscribed successfully");
        window.location.reload();
      } else {
        toast.error(response.messages);
      }
    } else {
      toast.error("Invalid Email.");
    }
  };

  return (
    <Modal
      isOpen={open}
      onRequestClose={closeModal}
      style={customStyles}
      shouldReturnFocusAfterClose={false}
      contentLabel="Newsletter Modal"
      className="container newsletter-popup-container h-auto"
      overlayClassName="d-flex align-items-center justify-content-center"
      id="newsletter-popup-form"
    >
      <div className="modal-content overflow-hidden">
        <div className="row justify-content-center position-relative">
          <div className="col-12">
            <div className="row no-gutters bg-white newsletter-popup-content">
              <div className="col-xl-3-5col col-lg-7 banner-content-wrap">
                <div className="banner-content text-center">
                  <h4>
                    Deals & Promotions Upto{" "}
                    <span style={{ fontWeight: "600", color: "green" }}>
                      30%
                    </span>{" "}
                    off
                  </h4>
                  <p>
                    Subscribe to the GRV Furniture to receive timely updates
                    from your favorite products.
                  </p>

                  <form action="#">
                    <div className="input-group input-group-round">
                      <input
                        type="text"
                        className="form-control form-control-white"
                        placeholder="Name"
                        onChange={(e) => {
                          setSubscriberMessage(e.target.value);
                        }}
                        aria-label="Email Adress"
                      />
                    </div>
                    <br />
                    <div className="input-group input-group-round">
                      <input
                        type="tel"
                        className="form-control form-control-white"
                        placeholder="Phone"
                        onChange={(e) => {
                          setSubscriberMobile(e.target.value);
                        }}
                        aria-label="Email Adress"
                      />
                    </div>
                    <br />
                    <div className="input-group input-group-round">
                      <input
                        type="email"
                        className="form-control form-control-white"
                        placeholder="Email"
                        onChange={(e) => {
                          setSubscriberEmail(e.target.value);
                        }}
                        aria-label="Email Adress"
                        required
                      />
                    </div>
                    <br />
                    <div className=" input-group input-group-append">
                      <button
                        className="btn btn-primary"
                        type="submit"
                        id="newsletter-btn"
                        onClick={handleSubscribe}
                      >
                        <span>Subscribe</span>
                        <i className="icon-long-arrow-right"></i>
                      </button>
                    </div>
                  </form>

                  <div
                    className="custom-control custom-checkbox pl-4 ml-3 popup-1"
                   
                   
                  >
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="register-policy"
                      onChange={handleChange}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="register-policy"
                    >
                      Do not show this popup again
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-xl-2-5col col-lg-5 d-none d-lg-block">
                <div className="lazy-overlay"></div>
                <LazyLoadImage
                  alt="newsletter"
                  src="images/popup/newsletter/image-3.png"
                  threshold={0}
                  width={390}
                  height={491}
                  effect="blur"
                  className="newsletter-img"
                />
              </div>
            </div>
          </div>
          <button
            title="Close (Esc)"
            type="button"
            className="mfp-close"
            onClick={closeModal}
          >
            <span>×</span>
          </button>
        </div>
      </div>
    </Modal>
  );

}

export default NewsletterModal;
