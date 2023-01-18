import { connect } from "react-redux";

import ALink from "~/components/features/alink";

import { actions } from "~/store/cart";
import { cartQtyTotal, cartPriceTotal } from "~/utils/index";

function CartMenu(props) {
  const { cartlist } = props;
  return (
    <div className="dropdown cart-dropdown">
      <ALink
        href="/shop/cart"
        className="dropdown-toggle"
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        data-display="static"
      >
        <div className="icon">
          <i className="icon-shopping-cart"></i>
          <span className="cart-count">{cartQtyTotal(cartlist)}</span>
        </div>
        <p>Cart</p>
      </ALink>

      <div
        className={`dropdown-menu dropdown-menu-right ${cartlist.length === 0 ? "text-center" : ""
          }`}
      >
        {0 === cartlist.length ? (
          <p>No products in the cart.</p>
        ) : (
          <>
            <div className="dropdown-cart-products">
              {cartlist.map((item, index) => (
                <div className="product justify-content-between" key={index}>
                  <div className="product-cart-details">
                    <h4 className="product-title">
                      <ALink href={`/product/default/${item._id}`}>
                        {item.name}
                      </ALink>
                    </h4>

                    <span className="cart-product-info">
                      <span className="cart-product-qty">{item.qty} Qty </span>
                      {/* {item.offerPrice ? item.offerPrice?.toFixed(2) : item.mrp?.toFixed(2)} */}
                    </span>
                  </div>

                  <figure className="product-image-container ml-2">
                    <ALink
                      href={`/product/default/${item._id}`}
                      className="product-image"
                    >
                      <img src={item && item.imageUrls ? item.imageUrls[0] : ''} alt="product" />
                    </ALink>
                  </figure>
                  <button
                    className="btn-remove"
                    title="Remove Product"
                    onClick={() => props.removeFromCart(item)}
                  >
                    <i className="icon-close"></i>
                  </button>
                </div>
              ))}
            </div>
            <div className="dropdown-cart-total">
              <span>Total</span>

              <span className="cart-total-price">
                $
                {cartPriceTotal(cartlist).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="dropdown-cart-action">
              <ALink
                href="/shop/cart"
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                GOTO CART
              </ALink>
              {/* <ALink
                href="/shop/checkout"
                className="btn btn-outline-primary-2"
              >
                <span>Checkout</span>
                <i className="icon-long-arrow-right"></i>
              </ALink> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    cartlist: state.cartlist.data,
  };
}

export default connect(mapStateToProps, { ...actions })(CartMenu);
