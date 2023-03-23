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

function Checkout(props) {
  const { cartlist } = props;
{console.log(cartlist),"cartlist"}
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [cartTotal, setCartTotal] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    console.log(props);
    setCartTotal(localStorage.getItem("cartTotal") || "");
    setUser(localStorage.getItem("user") || "");

  }, []);
console.log(cartlist,"kjhk")
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

  const handlePlaceOrder = async () => {
    console.log(cartlist, cartTotal);

    setOrderProcessing(true);

    let url =
      process.env.NEXT_PUBLIC_SERVER_URL + "/orders/place-order";
    const response = await postSubmitForm(url, {
      cartlist: cartlist,
      cartTotal: cartTotal,
       customer_details:user
    });
    console.log(response);

    if (response.url) {
      window.location.href = response.url;
    } else {
      setOrderProcessing(false);
      toast.error("Something went wrong.");
    }

    // if (response && response.status == 1) {
    //   setOrderPlaced(true);
    //   props.resetCart();
    //   toast.success("Order placed successfully.");
    // } else {
    //   console.log(response.message);
    //   setOrderPlaced(false);
    //   toast.error("Something went wrong.");
    // }
  };
  
console.log(user,"hjghjg");
  return (
    <div className="main">
      <PageHeader title="Checkout" subTitle="Shop" />
      <nav className="breadcrumb-nav">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <ALink href="/">Home</ALink>
            </li>
            <li className="breadcrumb-item">
              <ALink href="/shop/sidebar/3cols">Shop</ALink>
            </li>
            <li className="breadcrumb-item active">Checkout</li>
          </ol>
        </div>
      </nav>

      <div className="page-content">
        <div className="checkout">
          <div className="container">
            {/* <div className="checkout-discount">
              <form action="#" id="checkout-discount-form">
                <input
                  type="text"
                  className="form-control"
                  required
                  id="checkout-discount-input"
                  onClick={addOpacity}
                />
                <label
                  htmlFor="checkout-discount-input"
                  className="text-truncate"
                >
                  Have a coupon? <span>Click here to enter your code</span>
                </label>
              </form>
            </div> */}

            <div className="row">
              <div className="col-lg-9">
                <h1 className="checkout-title">Order Details :</h1>
                <div className="row">
                
                  <div
                    className="col-sm-6"
                    style={{ minHeight: 180, backgroundColor: "#eee" }}
                  >
                    <h2 className="checkout-title">Shipping Address</h2>
                    <p>
                      {props.cartlist[0].storeAddress.house_number}{" "}
                      {props.cartlist[0].storeAddress.street_address}{" "}
                      {props.cartlist[0].storeAddress.city}{" "}
                     
                      {props.cartlist[0].storeAddress.pincode}
                    </p>
                  </div>
                  <div className="col-sm-6">
                    <br />
                    <br />
                    <ALink
                      className="btn btn-primary btn-round"
                      href="/shop/cart"
                    >
                      <i className="icon-long-arrow-left"></i>
                      BACK TO CART
                    </ALink>
                  </div>
                </div>
              </div>

              <aside className="col-lg-3">
                <div className="summary">
                  <h3 className="summary-title">Your Order</h3>

                  <table className="table table-summary">
                    <thead>
                      <tr>
                        <th>Product</th>

                        <th>Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {cartlist.map((item, index) => (
                        <tr key={index}>
                          <td>
                            {" "}
                            <ALink href={`/product/default/${item._id}`}>
                              {item.name}
                            </ALink>
                          </td>

                          <td>
                            $
                            {item.sum.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))}

                      <tr className="summary-subtotal">
                        <td>SubTotal:</td>
                        <td>
                          $
                          {cartPriceTotal(cartlist).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                      {/* {discountValue && (
                          <tr className="summary-subtotal">
                            <td>Discount:</td>
                            <td>
                              {String(discountValue || "").toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </td>
                          </tr>
                        )} */}
                      <tr>
                        <td>Shipping:</td>
                        <td>
                          $
                          {cartlist[0].sum.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                      {cartlist.map((item, index) =>
                        item.coupon_details &&
                        Object.keys(item.coupon_details).length > 0 ? (
                          <tr>
                            <td>Coupon:</td>
                            <td>
                              <p>
                                Coupon Code: {item.coupon_details.coupon_code}
                              </p>
                              <p>
                                Discount Price:{" "}
                                {item.coupon_details.discount_type == "Percent"
                                  ? item.coupon_details.discount_value + "%"
                                  : "$" + item.coupon_details.discount_value}
                              </p>
                              {item.coupon_details.discount_type ==
                              "Percent" ? (
                                <p>
                                  Discount Value: {"$" + item.coupon_discount}
                                </p>
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                        ) : (
                          ""
                        )
                      )}

                      <tr>
                        <td>GST(18%):</td>
                        <td>
                          $
                          {String(cartlist[0]&&cartlist[0].gst|| "").toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                      <tr className="summary-total">
                        <td>Total:</td>
                        <td>
                          $
                          {String(cartTotal || "").toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {orderProcessing ? (
                    <button className="btn btn-outline-primary-2 btn-order btn-block">
                      <span className="btn-text">PLEASE WAIT...</span>
                      <span className="btn-hover-text">PLEASE WAIT...</span>
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-primary-2 btn-order btn-block"
                      onClick={handlePlaceOrder}
                    >
                      <span className="btn-text">PLACE ORDER</span>
                      <span className="btn-hover-text">PLACE ORDER</span>
                    </button>
                  )}
                </div>
              </aside>
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

export default connect(mapStateToProps, { ...actions })(Checkout);
