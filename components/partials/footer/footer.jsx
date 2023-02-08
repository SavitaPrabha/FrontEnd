import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import ALink from "~/components/features/alink";

function Footer() {
  const router = useRouter("");
  const [isBottomSticky, setIsBottomSticky] = useState(false);
  const [containerClass, setContainerClass] = useState("container");

  useEffect(() => {
    handleBottomSticky();
    setContainerClass(
      router.asPath.includes("fullwidth") ? "container-fluid" : "container-fluid"
    );
  }, [router.asPath]);

  useEffect(() => {
    window.addEventListener("resize", handleBottomSticky, { passive: true });
    return () => {
      window.removeEventListener("resize", handleBottomSticky);
    };
  }, []);

  function handleBottomSticky() {
    setIsBottomSticky(
      router.pathname.includes("product/default") && window.innerWidth > 991
    );
  }

  return (
    <footer className="footer footer-2">
      <div className="footer-middle">
        <div className={containerClass}>
          <div className="row">
            <div className="col-sm-12 col-lg-6">
              <div className="widget widget-about">
                <div className="row">
                  <div className="col-sm-12 col-lg-12">
                    <img
                      src="images/logo.png"
                      className="footer-logo"
                      alt="Footer Logo"
                      style={{ marginLeft: "30px" }}
                    />
                    <p
                      style={{
                        color: "rgb(171, 69, 10)",
                        /* textAlign: 'center', */ fontSize: "15px",
                        marginTop: "-20px",
                      }}
                    >
                      FURNITURE &amp; MATTRESS
                    </p>
                    <br />
                    <p>
                      <span
                        className="widget-title"
                        style={{ color: "#4b1d02" }}
                      >
                        Your comfort is our concern.
                      </span>
                      <br />
                      This isn’t just a statement for us at GRV. This is how we
                      make our daily & long-term choices – whether it’s the
                      product quality or customer service you experience.{" "}
                    </p>
                  </div>
                </div>

                <div className="widget-about-info">
                  <div className="row">
                    <div className="col-sm-7 col-md-7">
                      <span className="widget-title">
                        Got Question? Call us 24/7
                      </span>
                      <span className="widget-about-title">
                        Unit-3, 1181 Kennedy Road, Scarborough, ON, M1P 2L2{" "}
                        <br />
                        Contact
                        <ALink href="tel:647-344-5455"> : 647-344-5455</ALink>
                        <br />
                        Email :{" "}
                        <ALink href="mailto:info@grvfurniture.ca">
                          {" "}
                          info@grvfurniture.ca
                        </ALink>
                      </span>
                    </div>

                    <div className="col-sm-7 col-md-7">
                      <span
                        className="widget-about-title"
                        style={{ marginTop: "10px" }}
                      >
                        Unit-1, 1125 Kennedy Road, Scarborough, ON, M1P 2L2{" "}
                        <br />
                        Contact<a href="tel:416-901-7008"> : 416-901-7008</a>
                        <br />
                        Email :{" "}
                        <a href="mailto:myamfurniture@gmail.com">
                          {" "}
                          myamfurniture@gmail.com
                        </a>
                      </span>
                    </div>
                    <div className="col-sm-5 col-md-5">
                      <span className="widget-title">Payment Methods</span>
                      <figure className="footer-payments">
                        <img
                          src="images/payments.png"
                          alt="Payment methods"
                          width="272"
                          height="20"
                        />
                      </figure>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-4 col-lg-2">
              <div className="widget">
                <h4 className="widget-title">GRV App on mobile</h4>
                <br />
                <a
                  // href="https://play.google.com/store/apps/details?id=io.grv_mobile"
                  target="_blank"
                >
                  <img
                    src="images/play_store.png"
                    className="footer-logo"
                    alt="Play Store"
                    width="200"
                  />
                </a>
                <a
                  // href="https://apps.apple.com/ca/app/grv-f-m/id6444937549"
                  target="_blank"
                >
                  <img
                    src="images/app_store.png"
                    className="footer-logo"
                    alt="App Store"
                    width="200"
                  />
                </a>
              </div>
            </div>

            <div className="col-sm-4 col-lg-2">
              <div className="widget">
                <h4 className="widget-title">Useful Links</h4>

                <ul className="widget-list">
                  <li>
                    <ALink href="/about">About GRV</ALink>
                  </li>

                  <li>
                    <ALink href="/faq">FAQ</ALink>
                  </li>
                  <li>
                    <ALink href="/contact">Contact us</ALink>
                  </li>
                  <li>
                    <ALink href="/termsandconditions">
                      Terms and conditions
                    </ALink>
                  </li>
                  <li>
                    <ALink href="/privacypolicy">Privacy Policy</ALink>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-sm-4 col-lg-2">
              <div className="widget">
                <h4 className="widget-title">My Account</h4>

                <ul className="widget-list">
                  <li>
                    <ALink href="/login">Sign In/ Register</ALink>
                  </li>
                  <li>
                    <ALink href="/shop/cart">View Cart</ALink>
                  </li>
                  <li>
                    <ALink href="/shop/wishlist">My Wishlist</ALink>
                  </li>
                  {/* <li>
                    <ALink href="#">Track My Order</ALink>
                  </li> */}
                  {/* <li>
                    <ALink href="#">Help</ALink>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom" >
        <div className={containerClass}>
      
          <p className="footer-copyright" style={{color:"#ffffff"}} >
            Copyright © {new Date().getFullYear()} s – Hukkha and Bongs.
            All Rights Reserved.
          </p>

          <div className="social-icons social-icons-color">
            <span className="social-label" style={{color:"#ffffff"}}>Social Media</span>

            <a
              // href="https://www.facebook.com/mygrvfurniture"
              className="social-icon social-facebook"
              rel="noopener noreferrer"
              title="Facebook"
              target="_blank"
            >
              <img width="16px" src="images/facebook.png" />
            </a>

            <a
              // href="https://www.instagram.com/mygrvfurniture/"
              className="social-icon social-instagram"
              rel="noopener noreferrer"
              title="Instagram"
              target="_blank"
            >
              <img width="16px" src="images/instagram.png" />
            </a>
            <a
              // href="https://www.tiktok.com/@grvfurniture?lang=en"
              className="social-icon"
              rel="noopener noreferrer"
              title="TikTok"
              target="_blank"
            >
              <img width="16px" src="images/tiktok.png" />
            </a>
          </div>
        </div>
      </div>
      <br />
      {isBottomSticky ? <div className="mb-10"></div> : ""}
    </footer>
  );
}

export default React.memo(Footer);
