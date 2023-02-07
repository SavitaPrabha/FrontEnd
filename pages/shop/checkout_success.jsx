import { useEffect, useState } from "react";
import { connect } from "react-redux";
import SlideToggle from "react-slide-toggle";
import { actions } from "~/store/cart";

import ALink from "~/components/features/alink";
import Accordion from "~/components/features/accordion/accordion";
// import Card from "~/components/features/accordion/card";
import PageHeader from "~/components/features/page-header";

import { cartPriceTotal } from "~/utils/index";
import { toast } from "react-toastify";
import { postSubmitForm } from "~/helpers/forms_helper";

function CheckoutSuccess(props) {
  const { cartlist } = props;

  useEffect(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("session_id")) {
      const session_id = urlParams.get("session_id");

      let url = process.env.NEXT_PUBLIC_SERVER_URL + "/orders/order-success";

      const response = await postSubmitForm(url, {
        session_id,
      });

      if (response.status === 1) {
        props.resetCart();
        toast.success("Checkout done successfully.");
      } else {
        toast.error("Something went wrong.");
      }
    }
  }, []);

  function clearOpacity() {
    if (document.querySelector("#checkout-discount-input").value == "")
      document
        .querySelector("#checkout-discount-form label")
        .removeAttribute("style");
  }

  function addOpacity(e) {
    e.currentTarget.parentNode
      .querySelector("label")
      .setAttribute("style", "opacity: 0");
  }

  return (
    <div className="main">
      <PageHeader title="Checkout Success" subTitle="" />
      <nav className="breadcrumb-nav">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <ALink href="/">Home</ALink>
            </li>
            <li className="breadcrumb-item">
              <ALink href="/shop/sidebar/3cols">Shop</ALink>
            </li>
            <li className="breadcrumb-item active">Checkout Success</li>
          </ol>
        </div>
      </nav>

      <div className="page-content">
        <div className="checkout">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="cart-empty-page text-center">
                  <i
                    className="cart-empty icon-shopping-cart"
                    style={{ lineHeight: 1, fontSize: "15rem" }}
                  ></i>
                  <p className="px-3 py-2 cart-empty mb-3">
                    No checkouts pending.
                  </p>
                  <p className="return-to-shop mb-0">
                    <ALink
                      href="/shop/sidebar/3cols"
                      className="btn btn-primary"
                    >
                      RETURN TO SHOP
                    </ALink>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  cartlist: state.cartlist.data,
});

export default connect(mapStateToProps, { ...actions })(CheckoutSuccess);
