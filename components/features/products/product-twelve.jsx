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

function ProductTwelve(props) {
  const router = useRouter();
  const { product, wishlist } = props;
  const [maxPrice, setMaxPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(99999);
  const [selectedOffer, setselectedOffer] = useState();
  console.log(product, "product");
  // useEffect(() => {
  //   let min = minPrice;
  //   let max = maxPrice;
  //   min =
  //     product && product.variant_details[0].offer
  //       ? offerPrice(
  //           parseFloat(product.variant_details[0].variantPrice),
  //           product.variant_details[0].offer
  //         )
  //       : undefined; //Setting root image initially
  //   max =
  //     product && product.variant_details[0].variantPrice
  //       ? product.variant_details[0].variantPrice
  //       : ""; //Setting root image initially
  //   if (min) {
  //     setMinPrice(min);
  //   } else setMinPrice(max);
  //   setMaxPrice(max);
  //   if (
  //     product &&
  //     product.variant_details[0] &&
  //     product.variant_details[0].offer
  //   )
  //     setselectedOffer(product.variant_details[0].offer);
  // }, []);

  // function onCartClick(e) {
  //   e.preventDefault();
  //   const newProduct = {
  //     ...product,
  //     name: product.name,
  //     price: parseFloat(product.variant_details[0].variantPrice),
  //     color: product.variant_details[0].color,
  //     offer: product.variant_details[0].offer,
  //     offerPrice: offerPrice(
  //       parseFloat(product.variant_details[0].variantPrice),
  //       product.variant_details[0].offer
  //     ),
  //     weight: product.variant_details[0].weight,
  //     size: product.variant_details[0].size,
  //     imageUrls: product.variant_details[0].variantImgUrl,
  //     assembly_charges: product.variant_details[0].assembly_charges,
  //     is_online: product.variant_details[0].is_online,
  //   };

  //   console.log(props);
  //   props.addToCart(newProduct);
  // }

  // function onWishlistClick(e) {
  //   const newProduct = {
  //     ...product,
  //     name: product.name,
  //     mrp: parseFloat(product.variant_details[0].variantPrice),
  //     color: product.variant_details[0].color,
  //     offer: product.variant_details[0].offer,
  //     offerPrice: offerPrice(
  //       parseFloat(product.variant_details[0].variantPrice),
  //       product.variant_details[0].offer
  //     ),
  //     weight: product.variant_details[0].weight,
  //     size: product.variant_details[0].size,
  //     imageUrls: product.variant_details[0].variantImgUrl,
  //     assembly_charges: product.variant_details[0].assembly_charges,
  //     is_online: product.variant_details[0].is_online,
  //   };
  //   e.preventDefault();
  //   if (!isInWishlist(props.wishlist, newProduct)) {
  //     props.addToWishlist(newProduct);
  //   } else {
  //     router.push("/pages/wishlist");
  //   }
  // }

  // function onCompareClick(e) {
  //   e.preventDefault();
  //   if (!isInCompare(props.comparelist, product)) {
  //     props.addToCompare(product);
  //   }
  // }

  // function onQuickView(e) {
  //   e.preventDefault();
  //   props.showQuickView(product._id);
  // }

  // const offerPrice = (price, offer) => {
  //   //offer.end_date < current date
  //   let offerPrice;
  //   if (offer) {
  //     if (offer.discount_type && offer.discount_type == "Percent") {
  //       offerPrice = price - (price * offer.discount_value) / 100;
  //     } else if (offer.discount_type && offer.discount_type == "Flat") {
  //       offerPrice = price - offer.discount_value;
  //     }
  //   }
  //   return offerPrice;
  // };
  // const discountedValue = () => {
  //   let value = "";
  //   console.log(selectedOffer);
  //   switch (selectedOffer.discount_type) {
  //     case "Flat":
  //       value = "-" + selectedOffer.discount_value;
  //       break;
  //     case "Percent":
  //       value = "-" + selectedOffer.discount_value + "%";
  //       break;
  //     default:
  //       break;
  //   }
  //   console.log(value);
  //   return value;
  // };
  return (
    <div className="product product-11 text-center">
    
    <figure className="product-media">
        {product.new_label ? <span className="product-label label-new">New</span> : ""}

        {product.sale_price ? <span className="product-label label-sale">Sale</span> : ""}

        {product.top_label ? <span className="product-label">Top</span> : ""}

        {/* {!product.stock || product.stock == 0 ? (
          <span className="product-label">Out of Stock</span>
        ) : (
          ""
        )} */}

        <ALink href={`/product/default/${product._id}`}>
          <LazyLoadImage
            alt="product"
            src={ product.image_url}
            threshold={500}
            effect="black and white"
            wrapperClassName="product-image"
          />
          {product.image_url.length  ? (
            <LazyLoadImage
              alt="product"
              src={ product.image_url }
              threshold={500}
              effect="black and white"
              wrapperClassName="product-image-hover"
            />
          ) : (
            ""
          )}
        </ALink>

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
              //onClick={onWishlistClick}
            >
              <span>add to wishlist</span>
            </a>
          )}
        </div>
      </figure>

      <div className="product-body">
        <div className="product-cat">
          {/* <React.Fragment key={product.category}>
            <ALink
              href={{
                pathname: "/shop/sidebar/3cols",
                query: { category: product.category },
              }}
            >
              {product.category}
            </ALink>
          </React.Fragment> */}

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
        </div>

        <h3 className="product-title">
          <ALink href={`/product/default/${product._id}`}>{product.name}</ALink>
        </h3>
        <div className="product-price mt-1" style={{ display: "inline" }}>
           
              <b className="discount-value " style={{ color: "#1e1623" }}>
              ${product.price.toFixed(2)}
              </b>
            </div>
{/* 
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
                ${product.price.toFixed(2)}
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
        )} */}

        {/* <div className="ratings-container">
          <div className="ratings">
            <div
              className="ratings-val"
              style={{ width: product.ratings * 20 + "%" }}
            ></div>
            <span className="tooltip-text">{product.ratings.toFixed(1)}</span>
          </div>
          <span className="ratings-text">( {product.review} Reviews )</span>
        </div> */}
      </div>

      <div className="product-action">
        {
          <ALink
            className="btn-product "
            href={`/product/default/${product._id}`}
          >
            <span>View</span>
          </ALink>
        }
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
})(ProductTwelve);
