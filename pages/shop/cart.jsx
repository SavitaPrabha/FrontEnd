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
    console.log("useEffect[]");
    console.log(props);
    setLoading(true);
    setCartList(props.cartItems);
    let origin,
      destination,
      cart_value = 0;
    let store_url = process.env.NEXT_PUBLIC_SERVER_URL + "/stores/getall";
    const store_response = await postSubmitForm(store_url, null);
    if (store_response && store_response.status === 1) {
      setStores(store_response.data);
      if (props.cartItems.length > 0 && props.cartItems[0].storeAddress)
        setSelectedStore(props.cartItems[0].storeAddress);
      else setSelectedStore(store_response.data[0]);
      origin = store_response.data[0];
    }

    if (store.get("user")) {
      const u = store.get("user");
      setUser(u);

      if (props.cartItems.length > 0 && props.cartItems[0].shippingAddress) {
        setSelectedAddress(props.cartItems[0].shippingAddress);
        destination = props.cartItems[0].shippingAddress;
      } else {
        const address = u.addresses.filter(
          (address) => address.default_address
        );

        if (address.length > 0) {
          setSelectedAddress(address[0]);
          destination = address[0];
        } else if (u.addresses.length > 0) {
          setSelectedAddress(u.addresses[0]);
          destination = u.addresses[0];
        }
      }
    }
    console.log("from useEffect[]");
    cart_value = cartPriceTotal(props.cartItems);

    const shipping_charges = await get_shipping_charges(
      origin.pincode,
      destination ? destination.pincode : origin.pincode,
      cart_value
    );

    if (shipping_charges > 0) {
      console.log("c1", cart_value, shipping_charges);
      setcartTotal(cart_value + shipping_charges);
    }
    props.updateCart(
      props.cartItems,
      shipping_charges,
      origin,

      destination ? destination : -1
    );
    setLoading(false);
    // console.log(cartList)
  }, []);

  // useEffect(async () => {
  //   console.log("useEffect[props.cartItems]");

  //   setCartList(props.cartItems);
  //   if (selectedStore && selectedAddress)
  //     await get_shipping_charges(
  //       selectedStore.pincode,
  //       selectedAddress.pincode,
  //       cartPriceTotal(props.cartItems)
  //     );
  // }, [props.cartItems]);

  const get_shipping_charges = async (origin, destination, cart_value) => {
    console.log("get_shipping_charges", cart_value);
    let shipping_url =
      process.env.NEXT_PUBLIC_SERVER_URL + "/customers/get_shipping_charges";

    const shipping_response = await postSubmitForm(shipping_url, {
      origin,
      destination,
      cart_value,
    });

    if (shipping_response && shipping_response.status === 1) {
      setDistance(shipping_response.data.distance);
      setDistanceValue(shipping_response.data.distance_value);
      setShippingCost(shipping_response.data.shipping_charges);
      let total = cart_value + shipping_response.data.shipping_charges;
      console.log("c2", total);
      setcartTotal(total);
      return shipping_response.data.shipping_charges;
    } else {
      setDistance(null);
      setDistanceValue(null);
      setShippingCost(0);
      let total = cart_value;
      console.log("c3", total);
      setcartTotal(total);
      return 0;
    }
  };

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
    //console.log(selectedStore, selectedAddress);

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

  const handleCouponDiscount = async (coupon) => {
    const { discount_type, discount_value } = coupon;

    let updatedCartPrice,
      coupon_discount = 0;
    console.log("from handleCouponDiscount");
    switch (discount_type) {
      case "Flat":
        updatedCartPrice = cartPriceTotal(props.cartItems) - discount_value;
        setdiscountValue(+discount_value);
        console.log("c4", updatedCartPrice, shippingCost);
        setcartTotal(updatedCartPrice + shippingCost);
        setCouponDiscount(discount_value);

        break;
      case "Percent":
        coupon_discount =
          (discount_value / 100) * cartPriceTotal(props.cartItems);
        updatedCartPrice = cartPriceTotal(props.cartItems) - coupon_discount;
        setdiscountValue(+discount_value + "%");
        setafterdiscount(cartPriceTotal(props.cartItems) - updatedCartPrice);
        console.log("c5", updatedCartPrice, shippingCost);
        setcartTotal(updatedCartPrice + shippingCost);
        setCouponDiscount(coupon_discount);

        break;

      default:
        break;
    }
    props.updateCart(props.cartItems, -1, -1, -1, coupon, coupon_discount);
    console.log("hi");

    // if (selectedStore && selectedAddress) {
    //   const shipping_charges = await get_shipping_charges(
    //     selectedStore.pincode,
    //     selectedAddress.pincode,
    //     cartPriceTotal(cl)
    //   );

    //   props.updateCart(cl, shipping_charges, selectedStore, selectedAddress);
    // } else {
    //   props.updateCart(cl, -1, -1, -1);
    // }
  };

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

        //let total = cartPriceTotal(props.cartItems);

        // setCartList(...props.cartItems, {
        //   couponDetails: response.data.updatedcoupon,
        // });
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

  const handleRemoveCoupon = async (e, v) => {
    toast.info("Coupon Removed");

    setcartTotal(cartTotal + couponDiscount);
    setCouponDiscount(0);
    setCoupon();
    setCouponData();
    props.updateCart(props.cartItems, -1, -1, -1, "", "");
    //window.location.reload();
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
            {cartList.length > 0 ? (
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
                                {item.imageUrls[0] || item.variant_details ? (
                                  <figure className="product-media">
                                    <ALink href={""} className="product-image">
                                      <img
                                        src={
                                          item.imageUrls[0] ||
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
                    {/* <div className="cart-discount">
                      <form action="#">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            required
                            placeholder="Enter coupon"
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-outline-primary-2"
                              type="submit"
                            >
                              <i className="icon-long-arrow-right"></i>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div> */}

                    {/* <button
                      className="btn btn-outline-dark-2"
                      onClick={updateCart}
                    >
                      <span>UPDATE CART</span>
                      <i className="icon-refresh"></i>
                    </button> */}
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
                                Store Address :
                                <br />
                                {selectedStore && (
                                  <p>
                                    {selectedStore.name} {selectedStore.address}{" "}
                                    {selectedStore.pincode}
                                  </p>
                                )}
                                <a
                                  style={{
                                    color: "#a6c76c",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setStoreModal(!storeModal);
                                    return false;
                                  }}
                                >
                                  change store{" "}
                                  <i className="icon-long-arrow-right"></i>
                                </a>
                              </td>
                              <td>&nbsp;</td>
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
                                {user && selectedAddress && (
                                  <>
                                    <p>
                                      {selectedAddress.apartment_house_number}{" "}
                                      {selectedAddress.street_address}{" "}
                                      {selectedAddress.city}{" "}
                                      {selectedAddress.province}{" "}
                                      {selectedAddress.pincode}
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

                            {user && couponData ? (
                              <div>
                                <tr className="summary-shipping-estimate">
                                  <td>
                                    Coupon:
                                    <br />
                                    <p>Coupon Code: {couponData.coupon_code}</p>
                                    <p>
                                      Discount Price:{" "}
                                      {couponData.discount_type == "Percent"
                                        ? couponData.discount_value + "%"
                                        : "$" + couponData.discount_value}
                                    </p>
                                    {couponData.discount_type == "Percent" ? (
                                      <p>
                                        Discount Value: {"$" + afterdiscount}
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                    <p>
                                      <div
                                        style={{
                                          marginLeft: "150px",
                                          marginTop: "-30px",
                                        }}
                                      >
                                        <button
                                          className="btn-danger"
                                          id="newsletter-btn"
                                          onClick={async () => {
                                            handleRemoveCoupon();
                                          }}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            class="bi bi-trash"
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                            <path
                                              fill-rule="evenodd"
                                              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    </p>
                                  </td>
                                  <td>
                                    &nbsp;
                                    <br />
                                  </td>
                                </tr>
                              </div>
                            ) : (
                              <div className="row mt-2">
                                <div className="input-group">
                                  <input
                                    value={coupon}
                                    type="text"
                                    className="form-control"
                                    placeholder="Coupon"
                                    aria-label="coupon"
                                    aria-describedby="newsletter-btn"
                                    onChange={(e) => {
                                      setCoupon(e.target.value);
                                    }}
                                    required
                                  />

                                  <div className="input-group-append">
                                    <button
                                      className=" btn-primary"
                                      id="newsletter-btn"
                                      onClick={async () => {
                                        handleValidCoupon();
                                      }}
                                    >
                                      <span>Apply Coupon</span>
                                      <i className="icon-long-arrow-right"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {user && distance && selectedAddress && (
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
                        {/* <ALink
                            className="btn btn-outline-primary-2 btn-order btn-block"
                            href="/shop/checkout"
                            onClick={handleProceedToCheckout}
                          >
                            PROCEED TO CHECKOUT
                          </ALink> */}
                        {user && distance && selectedAddress && (
                          <Button
                            className="btn btn-outline-primary-2 btn-order btn-block"
                            onClick={handleProceedToCheckout}
                          >
                            PROCEED TO CHECKOUT
                          </Button>
                        )}
                        {user && !distance && (
                          <>
                            <span style={{ color: "#FF0000" }}>
                              Shipping not available at this pincode. Kindly
                              change the shipping address or click on the button
                              below to request a call back.
                            </span>
                            <button className="btn btn-outline-primary-2 btn-order btn-block">
                              REQUEST A CALLBACK
                            </button>
                          </>
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

      {/* Store Address Modal */}
      <Modal
        size="lg"
        isOpen={storeModal}
        toggle={() => setStoreModal(!storeModal)}
      >
        <ModalBody>
          <>
            <Row>
              {stores &&
                stores.map((store, index) => {
                  return (
                    <div className="col-lg-6">
                      <div className="card card-dashboard">
                        <div
                          className="card-body"
                          style={{ cursor: "pointer" }}
                          onClick={async () => {
                            setSelectedStore(store);
                            setStoreModal(!storeModal);
                            const shipping_charges = await get_shipping_charges(
                              store.pincode,
                              selectedAddress
                                ? selectedAddress.pincode
                                : store.pincode,
                              cartPriceTotal(props.cartItems)
                            );
                            console.log(shipping_charges);
                            props.updateCart(
                              props.cartItems,
                              shipping_charges,
                              store,

                              -1
                            );
                          }}
                        >
                          <h3 className="card-title">{store.name}</h3>

                          <p>
                            {store.address}
                            <br />

                            {store.pincode}
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
                            const shipping_charges = await get_shipping_charges(
                              selectedStore.pincode,
                              address.pincode,
                              cartPriceTotal(props.cartItems)
                            );
                            props.updateCart(
                              props.cartItems,
                              shipping_charges,
                              -1,
                              address
                            );
                            setAddressModal(!addressModal);
                          }}
                        >
                          <h5>Address # {index + 1}</h5>
                          <p>
                            <strong> Apartment / House No.:</strong>{" "}
                            {address.apartment_house_number}
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
