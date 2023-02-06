import React, { useState, useEffect } from "react";
import Router from "next/router";
import { connect } from "react-redux";
import { postSubmitForm } from "~/helpers/forms_helper";
import store from "store";
import {
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Button,
  CardTitle,
  CardSubtitle,
  Container,
} from "reactstrap";

import ALink from "~/components/features/alink";
import Qty from "~/components/features/qty";
import PageHeader from "~/components/features/page-header";

import { actions as cartAction } from "~/store/cart";
import { cartPriceTotal } from "~/utils/index";

import Loader from "react-loader-spinner";
import { toast } from "react-toastify";

function Cart(props) {
  const [user, setUser] = useState(null);
  const [cartList, setCartList] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [cartTotal, setcartTotal] = useState(0);
  const [afterdiscount, setafterdiscount] = useState(0);
  const [stores, setStores] = useState([]);
  const [storeModal, setStoreModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState();
  const [selectedAddress, setSelectedAddress] = useState();
  const [addressModal, setAddressModal] = useState(false);
  const [distance, setDistance] = useState("");
  const [distance_value, setDistanceValue] = useState();

  const [loading, setLoading] = useState(false);

  

  useEffect(async () => {
    const u = store.get("user");
    setCartList(props.cartItems);
    setUser(u);
    let cart_value=0
    cart_value = cartPriceTotal(props.cartItems);
    setcartTotal(cart_value);
    props.updateCart(
          props.cartItems,
        );
  }, []);

  // 
  const changeQty = async (value, index) => {
    props.updateCart(props.cartItems, -1, -1, -1, {}, 0);
    setCouponDiscount(0);
    setCoupon();
    setCouponData();

    setLoading(true);
    const cl = cartList.map((item, ind) => {
      if (ind == index) {
        let sum;
        if (item.is_assembly_charges == true) {
          sum =
            (item.sale_price
              ? item.sale_price + item.assembly_charges
              : item.price + item.assembly_charges) * value;
        } else {
          sum = (item.sale_price ? item.sale_price : item.price) * value;
        }
        return {
          ...item,
          qty: value,
          sum: sum,
        };
      }

      return item;
    });
    setCartList(cl);
   
   

    if (selectedStore && selectedAddress) {
      console.log("from changeQty");
      const shipping_charges = await get_shipping_charges(
        selectedStore.pincode,
        selectedAddress.pincode,
        cartPriceTotal(cl)
      );

      props.updateCart(cl, shipping_charges, selectedStore, selectedAddress);
    } else {
      props.updateCart(cl, -1, -1, -1);
    }
    setLoading(false);
  };

  const handleIsAssemblyCharges = async (e) => {
    setLoading(true);
    const cl = cartList.map((item, ind) => {
      if (item._id == e.target.value) {
        let sum;
        if (e.target.checked == true) {
          sum =
            (item.sale_price
              ? item.sale_price + item.assembly_charges
              : item.price + item.assembly_charges) * item.qty;
        } else {
          sum = (item.sale_price ? item.sale_price : item.price) * item.qty;
        }

        return {
          ...item,
          is_assembly_charges: e.target.checked,
          sum: sum,
        };
      }
      return item;
    });
    setCartList(cl);

    if (selectedStore && selectedAddress) {
      console.log("from handleIsAssemblyCharges");
      const shipping_charges = await get_shipping_charges(
        selectedStore.pincode,
        selectedAddress.pincode,

        cartPriceTotal(cl)
      );

      props.updateCart(
        cl,
        shipping_charges,
        selectedStore,
        selectedAddress,
        {},
        0
      );
    } else {
      props.updateCart(cl, -1, -1, -1, {}, 0);
    }
    setLoading(false);

    setCouponDiscount(0);
    setCoupon();
    setCouponData();
  };

  const [discountValue, setdiscountValue] = useState();

  // 
  const handleProceedToCheckout = async () => {
    let is_assembly_charges = false;
    localStorage.setItem("cartTotal", cartTotal+(cartTotal*13)/100);
    localStorage.setItem("discountvalue", discountValue);

    cartList.map((item, ind) => {
      if (item.is_assembly_charges == true) is_assembly_charges = true;
    });
    props.updateCart(props.cartItems, -1, -1, -1, -1, -1,(cartTotal*13)/100);
    if (is_assembly_charges == true && distance_value > 250000)
      toast.error("Assembling facility is not available beyond 250 km.");
    else Router.push("/shop/checkout");
  };

  const [coupon, setCoupon] = useState(null);
  const [couponData, setCouponData] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState();

  const handleValidCoupon = async (e, v) => {
    console.log(coupon);
    setLoading(true);

    let url = process.env.NEXT_PUBLIC_ASSET_URI + "/coupons/is_valid_coupon";
    const response = await postSubmitForm(url, {
      coupon_code: coupon,
      min_cart_value: cartTotal,
    });
    if (response && response.status === 1) {
      console.log(response);
      if (response.data) {
        handleCouponDiscount(response.data);
        setCouponData(response.data);

        //
        toast.success(response.message);
      } else {
        toast.warn(response.message);
      }
      setLoading(false);
    } else {
      setLoading(false);
      toast.error("Please Enter Coupon Code");
    }
  };

  

  return (
    <div className="main">
      <PageHeader title="Shopping Cart" subTitle="Shop" />
      <nav className="breadcrumb-nav">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <ALink href="/">Home</ALink>
            </li>
            <li className="breadcrumb-item">
              <ALink href="/shop/sidebar/3cols">Shop</ALink>
            </li>
            <li className="breadcrumb-item active">Shopping Cart</li>
          </ol>
        </div>
      </nav>

      <div className="page-content pb-5">
        <div className="cart">
          <div className="container">
            {console.log(cartList,"njkhk")}
            {cartList&&cartList.length > 0 ? (
              <div className="row">
                <div className="col-lg-9">
                  <table className="table table-cart table-mobile">
                    <thead>
                      <tr>
                        <th>Product</th>

                        <th>Price</th>
                        <th>Assembly Charges</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {cartList.length ? (
                        cartList.map((item, index) => (
                          <tr key={index}>
                            <td className="product-col">
                              <div className="product">
                                {item.image_url || item.variant_details ? (
                                  <figure className="product-media">
                                    <ALink href={""} className="product-image">
                                      <img
                                        src={
                                          item.image_url ||
                                          item.variant_details[0]
                                            .variantImgUrl[0]
                                        }
                                        alt="product"
                                      />
                                    </ALink>
                                  </figure>
                                ) : (
                                  ""
                                )}

                                <h4 className="product-title">
                                  <ALink href={""}>{item.name}</ALink>
                                </h4>
                              </div>
                            </td>

                            <td className="price-col">
                              $
                              {item.price
                                ? item.price.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                : ""}
                            </td>
                            <td className="assembly-charges-col">
                              <input
                                type="checkbox"
                                id={"is_assembly_charges" + (index + 1)}
                                disabled={
                                  item?.assembly_charges > 0 ? false : true
                                }
                                value={item._id}
                                onChange={handleIsAssemblyCharges}
                                checked={item.is_assembly_charges}
                              />{" "}
                              <label
                                title="Check to get product assembled at your shipping address."
                                for={"is_assembly_charges" + (index + 1)}
                              >
                                $
                                {item?.assembly_charges?.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </label>
                            </td>

                            <td className="quantity-col">
                              <Qty
                                value={item.qty}
                                changeQty={(current) =>
                                  changeQty(current, index)
                                }
                                adClass="cart-product-quantity"
                              ></Qty>
                            </td>

                            <td className="total-col">
                              $
                              {item.sum?.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>

                            <td className="remove-col">
                              <button
                                className="btn-remove"
                                onClick={() => {
                                  props.removeFromCart(item);

                                  const cl = cartList.filter(
                                    (it) => it != item
                                  );
                                  if (selectedStore && selectedAddress) {
                                    const shipping_charges =
                                      get_shipping_charges(
                                        selectedStore.pincode,
                                        selectedAddress.pincode,
                                        cartPriceTotal(cl)
                                      );

                                    props.updateCart(
                                      cl,
                                      shipping_charges,
                                      selectedStore,
                                      selectedAddress
                                    );
                                  } else {
                                    props.updateCart(cl, -1, -1, -1);
                                  }

                                  setCartList(cl);
                                }}
                              >
                                <i className="icon-close"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td>
                            <p className="pl-2 pt-1 pb-1">
                              {" "}
                              No Products in Cart{" "}
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="cart-bottom">
                   

                   
                  </div>
                </div>
                <aside className="col-lg-3">
                  <div
                    className="summary summary-cart"
                    style={{ minHeight: "700px" }}
                  >
                    <h3 className="summary-title">Cart Total</h3>
                    {loading && (
                      <center>
                        <Loader
                          type="Puff"
                          color="#a6c76c"
                          secondaryColor="Grey"
                          height={100}
                          width={100}
                        />
                      </center>
                    )}
                    {!loading && (
                      <>
                        <table className="table table-summary">
                          <tbody>
                            <tr className="summary-subtotal">
                              <td>Subtotal:</td>
                              <td>
                                $
                                {cartPriceTotal(props.cartItems).toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </td>
                            </tr>

                           
                            <tr className="summary-shipping-estimate">
                              <td>
                                Shipping Address :
                                <br />
                                {!user && (
                                  <>
                                    Please{" "}
                                    <ALink
                                      href="/login"
                                      style={{ color: "#a6c76c" }}
                                    >
                                      <span>Sign In / Register</span>
                                    </ALink>{" "}
                                    to manage shipping address.
                                  </>
                                )}
                                {user &&  (
                                  <>
                                    <p>
                                      {user.house_number}{" "}
                                      {user.street_address}{" "}
                                      {user.city}{" "}
                                     
                                      {user.pincode}
                                    </p>
                                    <a
                                      style={{
                                        color: "#a6c76c",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        setAddressModal(!addressModal);
                                      }}
                                    >
                                      change address{" "}
                                      <i className="icon-long-arrow-right"></i>
                                    </a>
                                  </>
                                )}
                                {user && !selectedAddress && (
                                  <>
                                    <p>No addresses found.</p>
                                    <a
                                      href="/shop/dashboard"
                                      style={{ color: "#a6c76c" }}
                                    >
                                      go to account{" "}
                                      <i className="icon-long-arrow-right"></i>
                                    </a>
                                  </>
                                )}
                              </td>
                              <td>&nbsp;</td>
                            </tr>
                            {user && distance && selectedAddress && (
                              <>
                                <tr className="summary-shipping-estimate">
                                  <td>
                                    Shipping Charges :
                                    <br />
                                    <p>Distance: {distance}</p>
                                  </td>
                                  <td>
                                    &nbsp;
                                    <br />
                                    <p>
                                      $
                                      {shippingCost.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </p>
                                  </td>
                                </tr>
                              </>
                            )}

                           

                            {user && (
                              <tr className="summary-total">
                                <td>Total:</td>
                                <td>
                                  $
                                  {cartTotal.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                 
                        {user && selectedAddress && (
                          <Button
                            className="btn btn-outline-primary-2 btn-order btn-block"
                            onClick={handleProceedToCheckout}
                          >
                            PROCEED TO CHECKOUT
                          </Button>
                        )}
                      
                      </>
                    )}
                  </div>
                </aside>
              </div>
            ) : (
              <div className="row">
                <div className="col-12">
                  <div className="cart-empty-page text-center">
                    <i
                      className="cart-empty icon-shopping-cart"
                      style={{ lineHeight: 1, fontSize: "15rem" }}
                    ></i>
                    <p className="px-3 py-2 cart-empty mb-3">
                      No products added to the cart
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
            )}
          </div>
        </div>
      </div>

    

      {/* Shipping Address Modal */}
      <Modal
        size="lg"
        isOpen={addressModal}
        toggle={() => setAddressModal(!addressModal)}
      >
        <ModalBody>
          <>
            <Row>
              {user &&
                user.addresses.map((address, index) => {
                  return (
                    <div className="col-lg-6">
                      <div className="card card-dashboard">
                        <div
                          className="card-body"
                          style={{ cursor: "pointer" }}
                          onClick={async () => {
                            setSelectedAddress(address);
                           
                            props.updateCart(
                              props.cartItems,
                              
                              -1,
                              address
                            );
                            setAddressModal(!addressModal);
                          }}
                        >
                          <h5>Address # {index + 1}</h5>
                          <p>
                            <strong> Apartment / House No.:</strong>{" "}
                            {address.house_number}
                            <br />
                            <strong>Street Address:</strong>{" "}
                            {address.street_address}
                            <br />
                            <strong>City: </strong>
                            {address.city}
                            <br />
                            <strong> Province:</strong> {address.province}
                            <br />
                            <strong>Pincode: </strong>
                            {address.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Row>
          </>
        </ModalBody>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => ({
  cartItems: state.cartlist.data,
});

export default connect(mapStateToProps, { ...cartAction })(Cart);
