import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import ALink from "~/components/features/alink";
import PageHeader from "~/components/features/page-header";

import { actions as wishlistAction } from "~/store/wishlist";
import { actions as cartAction } from "~/store/cart";

function Wishlist(props) {
  const [wishItems, setWishItems] = useState([]);

  useEffect(() => {
    setWishItems(
      props.wishlist.reduce((acc, product) => {
        let max = 0;
        let min = 999999;
        min = product && product.offerPrice ? product.offerPrice : undefined; //Setting root image initially
        max = product && product.mrp ? product.mrp : ""; //Setting root image initially

        return [
          ...acc,
          {
            ...product,
            minPrice: min ? min : max,
            maxPrice: max,
          },
        ];
      }, [])
    );
  }, [props.wishlist]);

  function moveToCart(product) {
    props.removeFromWishlist(product);
    props.addToCart(product);
  }

  return (
    <main className="main">
      <PageHeader title="Wishlist" subTitle="Shop" />
      <nav className="breadcrumb-nav">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <ALink href="/">Home</ALink>
            </li>
            <li className="breadcrumb-item">
              <ALink href="/shop/sidebar/3cols">Shop</ALink>
            </li>
            <li className="breadcrumb-item active">Wishlist</li>
          </ol>
        </div>
      </nav>
      {/* //product && // product.name && // product.name.toString().split(" ")[0]
      == "Combo" ? */}
      <div className="page-content pb-5">
        {wishItems.length > 0 ? (
          <div className="container">
            <table className="table table-wishlist table-mobile">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  {/* <th>Stock Status</th> */}
                  <th>#</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {wishItems.map((product, index) => (
                  <tr key={index}>
                    <td className="product-col">
                      <div className="product">
                        <figure className="product-media">
                          {product.name &&
                          product.name.toString().split(" ")[0] == "Combo" ? (
                            <ALink
                              href={`/product/defaultcombo/${product._id}`}
                              className="product-image"
                            >
                              <img
                                src={
                                  product.image_url ||
                                  product.variant_details[0].variantImgUrl[0]
                                }
                                alt="product"
                              />
                            </ALink>
                          ) : (
                            <ALink
                              href={`/product/default/${product._id}`}
                              className="product-image"
                            >
                              <img
                                src={
                                  product.image_url ||
                                  product.variant_details[0].variantImgUrl[0]
                                }
                                alt="product"
                              />
                            </ALink>
                          )}
                        </figure>

                        <h4 className="product-title">
                          <ALink href={""}>{product.name}</ALink>
                        </h4>
                      </div>
                    </td>
                    <td className="price-col">
                      {product.mrp ? (
                        <b
                          style={{ color: "#00bd10" }}
                          className=" d-inline-block mb-0"
                        >
                          ${product.mrp.toFixed(2)}
                        </b>
                      ) : (
                        <div className="product-price d-inline-block mb-0">
                          ${"-"}
                        </div>
                      )}
                    </td>
                    {/* <td className="stock-col">
                      <span className={"in-stock"}>{"In stock"}</span>
                    </td> */}
                    <td className="action-col">
                      <div className="dropdown">
                        {product.name &&
                        product.name.toString().split(" ")[0] == "Combo" ? (
                          <ALink
                            href={`/product/defaultcombo/${product._id}`}

                            // onClick={(e) => moveToCart(product)}
                          >
                            <i className="icon-cart-plus"></i>
                            View Details
                          </ALink>
                        ) : (
                          <ALink
                            href={`/product/default/${product._id}`}

                            // onClick={(e) => moveToCart(product)}
                          >
                            <i className="icon-cart-plus"></i>
                            View Details
                          </ALink>
                        )}
                      </div>
                    </td>
                    <td className="remove-col">
                      <button
                        className="btn-remove"
                        onClick={(e) => props.removeFromWishlist(product)}
                      >
                        <i className="icon-close"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="wishlist-share">
              <div className="social-icons social-icons-sm mb-2">
                <label className="social-label">Share on:</label>
                <a
                  href="https://www.facebook.com/mygrvfurniture"
                  className="social-icon"
                  title="Facebook"
                  target="_blank"
                >
                  <i className="icon-facebook-f"></i>
                </a>
                {/* <ALink href="#" className="social-icon" title="Twitter">
                  <i className="icon-twitter"></i>
                </ALink> */}
                <a
                  href="https://www.instagram.com/mygrvfurniture/"
                  className="social-icon"
                  title="Instagram"
                  target="_blank"
                >
                  <i className="icon-instagram"></i>
                </a>
                {/* <ALink href="#" className="social-icon" title="Youtube">
                  <i className="icon-youtube"></i>
                </ALink>
                <ALink href="#" className="social-icon" title="Pinterest">
                  <i className="icon-pinterest"></i>
                </ALink> */}
              </div>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="text-center">
              <i
                className="icon-heart-o wishlist-empty d-block"
                style={{ fontSize: "15rem", lineHeight: "1" }}
              ></i>
              <span className="d-block mt-2">
                No products added to wishlist
              </span>
              <ALink
                href="/shop/sidebar/3cols"
                className="btn btn-primary mt-2"
              >
                Go Shop
              </ALink>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const mapStateToProps = (state) => ({
  wishlist: state.wishlist.data,
});

export default connect(mapStateToProps, { ...wishlistAction, ...cartAction })(
  Wishlist
);
