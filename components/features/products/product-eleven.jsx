import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";

import ALink from "~/components/features/alink";

import { actions as wishlistAction } from "~/store/wishlist";
import { actions as cartAction } from "~/store/cart";
import { actions as compareAction } from "~/store/compare";
import { actions as demoAction } from "~/store/demo";

import { isInWishlist, isInCompare } from "~/utils";

function ProductEleven(props) {
  const router = useRouter();
  const { product, wishlist } = props;
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minPrice, setMinPrice] = useState(0);
  const [selectedOffer, setselectedOffer] = useState();
  useEffect(() => {
    let min = minPrice;
    let max = maxPrice;
    min =
      product && product.variant_details[0].offer
        ? offerPrice(
            parseFloat(product.variant_details[0].variantPrice),
            product.variant_details[0].offer
          )
        : undefined; //Setting root image initially
    max =
      product && product.variant_details[0].variantPrice
        ? product.variant_details[0].variantPrice
        : ""; //Setting root image initially
    if (min) {
      setMinPrice(min);
    } else setMinPrice(max);
    setMaxPrice(max);
    if (
      product &&
      product.variant_details[0] &&
      product.variant_details[0].offer
    )
      setselectedOffer(product.variant_details[0].offer);
  }, []);

  function onCartClick(e) {
    let newProduct = {
      ...product,
      name: product.name,
      mrp: parseFloat(product.variant_details[0].variantPrice),
      color: product.variant_details[0].color,
      offer: product.variant_details[0].offer,
      offerPrice: offerPrice(
        parseFloat(product.variant_details[0].variantPrice),
        product.variant_details[0].offer
      ),
      weight: product.variant_details[0].weight,
      size: product.variant_details[0].size,
      imageUrls: product.variant_details[0].variantImgUrl,
      assembly_charges: product.variant_details[0].assembly_charges,
      is_online: product.variant_details[0].is_online,
    };
    e.preventDefault();

    props.addToCart(newProduct);
  }

  function onWishlistClick(e) {
    let newProduct = {
      ...product,
      name: product.name,
      mrp: parseFloat(product.variant_details[0].variantPrice),
      color: product.variant_details[0].color,
      offer: product.variant_details[0].offer,
      offerPrice: offerPrice(
        parseFloat(product.variant_details[0].variantPrice),
        product.variant_details[0].offer
      ),
      weight: product.variant_details[0].weight,
      size: product.variant_details[0].size,
      imageUrls: product.variant_details[0].variantImgUrl,
      assembly_charges: product.variant_details[0].assembly_charges,
      is_online: product.variant_details[0].is_online,
    };

    e.preventDefault();
    if (!isInWishlist(props.wishlist, newProduct)) {
      console.log(newProduct);
      props.addToWishlist(newProduct);
    } else {
      router.push("/pages/wishlist");
    }
  }
  const offerPrice = (price, offer) => {
    //offer.end_date < current date
    console.log(price, offer);
    let offerPrice;
    if (offer) {
      if (offer.discount_type && offer.discount_type == "Percent") {
        offerPrice = price - (price * offer.discount_value) / 100;
      } else if (offer.discount_type && offer.discount_type == "Flat") {
        offerPrice = price - offer.discount_value;
      }
    }
    return offerPrice;
  };
  function onCompareClick(e) {
    e.preventDefault();
    if (!isInCompare(props.comparelist, product)) {
      props.addToCompare(product);
    }
  }

  function onQuickView(e) {
    e.preventDefault();
    props.showQuickView(product.slug);
  }
  const discountedValue = () => {
    let value = "";
    console.log(selectedOffer);
    switch (selectedOffer.discount_type) {
      case "Flat":
        value = "-" + selectedOffer.discount_value;
        break;
      case "Percent":
        value = "-" + selectedOffer.discount_value + "%";
        break;
      default:
        break;
    }
    console.log(value);
    return value;
  };
  return (
    <div className="product product-7 text-center w-100">
      <figure className="product-media">
        {product.new_label ? (
          <span className="product-label label-new">New</span>
        ) : (
          ""
        )}

        {product.sale_price ? (
          <span className="product-label label-sale">Sale</span>
        ) : (
          ""
        )}
        {product.variant_details[0].offer &&
        product.variant_details[0].offer.name ? (
          <b className="product-label label-square label-offer">
            {product.variant_details[0].offer.name}
          </b>
        ) : (
          ""
        )}
        {product.top_label ? (
          <span className="product-label label-top">Top</span>
        ) : (
          ""
        )}

        {/* {
                    !product.stock || product.stock == 0 ?
                        <span className="product-label label-out">Out of Stock</span>
                        : ""
                } */}

        <ALink href={`/product/default/${product._id}`}>
          <LazyLoadImage
            alt="product"
            src={product.variant_details[0].variantImgUrl[0]}
            threshold={500}
            effect="black and white"
            wrapperClassName="product-image"
          />
          {product.image2 ? (
            <LazyLoadImage
              alt="product"
              src={product.variant_details[0].variantImgUrl[0]}
              threshold={500}
              // style={{ padding: "75%" }}
              effect="black and white"
              wrapperClassName="product-image-hover"
            />
          ) : (
            ""
          )}
        </ALink>

        {product.stock > 0 ? (
          <div className="product-action-vertical">
            {isInWishlist(wishlist, product) ? (
              <ALink
                href="/shop/wishlist"
                className="btn-product-icon btn-wishlist btn-expandable added-to-wishlist"
              >
                <span>go to wishlist</span>
              </ALink>
            ) : (
              <a
                href="#"
                className="btn-product-icon btn-wishlist btn-expandable"
                onClick={onWishlistClick}
              >
                <span>add to wishlist</span>
              </a>
            )}
            {/* <a
              href="#"
              className="btn-product-icon btn-quickview"
              title="Quick View"
              onClick={onQuickView}
            >
              <span>quick view</span>
            </a>
            <a
              href="#"
              className="btn-product-icon btn-compare"
              onClick={onCompareClick}
            >
              <span>compare</span>
            </a> */}
          </div>
        ) : (
          <div className="product-action-vertical">
            {isInWishlist(wishlist, product) ? (
              <ALink
                href="/shop/wishlist"
                className="btn-product-icon btn-wishlist btn-expandable added-to-wishlist"
              >
                <span>go to wishlist</span>
              </ALink>
            ) : (
              <a
                href="#"
                className="btn-product-icon btn-wishlist btn-expandable"
                onClick={onWishlistClick}
              >
                <span>add to wishlist</span>
              </a>
            )}
            {/* <a
              href="#"
              className="btn-product-icon btn-quickview"
              title="Quick View"
              onClick={onQuickView}
            >
              <span>quick view</span>
            </a> */}
          </div>
        )}

        {/* {product.stock && product.stock !== 0 ? (
          <div className="product-action">
            {product.variants.length > 0 ? (
              <ALink
                href={`/product/default/${product.slug}`}
                className="btn-product btn-cart btn-select"
              >
                <span>select options</span>
              </ALink>
            ) : (
              <button className="btn-product btn-cart" onClick={onCartClick}>
                <span>add to cart</span>
              </button>
            )}
          </div>
        ) : (
          ""
        )} */}
        <div className="product-action">
          <ALink
            className="btn-product"
            href={`/product/default/${product._id}`}
          >
            <span>View</span>
          </ALink>
        </div>
      </figure>

      <div className="product-body">
        <div className="product-cat">
          {/* {product.category.map((item, index) => (
            <React.Fragment key={item.slug + "-" + index}>
              <ALink
                href={{
                  pathname: "/shop/sidebar/3cols",
                  query: { category: item.slug },
                }}
              >
                {item.name}
              </ALink>
              {index < product.category.length - 1 ? ", " : ""}
            </React.Fragment>
          ))} */}
          <ALink
            href={{
              pathname: "/shop/sidebar/3cols",
              query: { category: product.category },
            }}
          >
            {product.category}
          </ALink>
        </div>

        <h3 className="product-title">
          <ALink href={`/product/default/${product._id}`}>{product.name}</ALink>
        </h3>

        {minPrice && maxPrice ? (
          product.stock == 0 ? (
            <div className="product-price">
              <span className="out-price">
                {minPrice == maxPrice ? (
                  <span>${product.price.toFixed(2)}</span>
                ) : (
                  <span>
                    ${minPrice.toFixed(2)}&ndash;${maxPrice.toFixed(2)}
                  </span>
                )}
              </span>
            </div>
          ) : minPrice == maxPrice ? (
            <b className=" mt-1" style={{ color: "#00bd10" }}>
              ${minPrice?.toFixed(2)}
            </b>
          ) : (
            <div className="product-price mt-1" style={{ display: "inline" }}>
              <div>
                <span style={{ textDecoration: "line-through", color: "red" }}>
                  ${maxPrice?.toFixed(2)}
                </span>{" "}
                {discountedValue()}{" "}
              </div>
              <b className="discount-value " style={{ color: "#00bd10" }}>
                ${minPrice.toFixed(2)}
              </b>
            </div>
          )
        ) : (
          ""
        )}
        {/* {!product.stock || product.stock == 0 ? (
          <div className="product-price">
            <span className="out-price">${product.mrp.toFixed(2)}</span>
          </div>
        ) : minPrice == maxPrice ? (
          <div className="product-price">${minPrice.toFixed(2)}</div>
        ) : product.variants.length == 0 ? (
          <div className="product-price">
            <span className="new-price">${minPrice.toFixed(2)}</span>
            <span className="old-price">${maxPrice.toFixed(2)}</span>
          </div>
        ) : (
          <div className="product-price">
            ${minPrice.toFixed(2)}&ndash;${maxPrice.toFixed(2)}
          </div>
        )} */}

        <div className="ratings-container">
          <div className="ratings">
            <div
              className="ratings-val"
              style={{ width: product.ratings * 20 + "%" }}
            ></div>
            <span className="tooltip-text">{product.ratings.toFixed(1)}</span>
          </div>
          <span className="ratings-text">( {product.review} Reviews )</span>
        </div>

        {/* {product.variants.length > 0 ? (
          <div className="product-nav product-nav-dots">
            <div className="row no-gutters">
              {product.variants.map((item, index) => (
                <ALink
                  href="#"
                  style={{ backgroundColor: item.color }}
                  key={index}
                >
                  <span className="sr-only">Color Name</span>
                </ALink>
              ))}
            </div>
          </div>
        ) : (
          ""
        )} */}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    wishlist: state.wishlist.data,
    comparelist: state.comparelist.data,
  };
};

export default connect(mapStateToProps, {
  ...wishlistAction,
  ...cartAction,
  ...compareAction,
  ...demoAction,
})(ProductEleven);
