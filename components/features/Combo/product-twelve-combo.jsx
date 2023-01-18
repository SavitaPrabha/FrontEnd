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

function ProductTwelveCombo(props) {
  const router = useRouter();
  const { combo, wishlist } = props;
  const [maxPrice, setMaxPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(99999);
  const [selectedOffer, setselectedOffer] = useState();


  function onCartClick(e) {
    e.preventDefault();
    const newProduct = {
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

    console.log(props);
    props.addToCart(newProduct);
  }

  function onWishlistClick(e) {
    const newProduct = {
      ...combo,
      name: combo.name,
      mrp: parseFloat(combo.combo_price),

      imageUrls: combo.image_url,
      assembly_charges: combo.assembly_charges,
      is_online: combo.is_online,
    };
    e.preventDefault();
    if (!isInWishlist(props.wishlist, newProduct)) {
      props.addToWishlist(newProduct);
    } else {
      router.push("/pages/wishlist");
    }
  }

  function onCompareClick(e) {
    e.preventDefault();
    if (!isInCompare(props.comparelist, product)) {
      props.addToCompare(product);
    }
  }

  function onQuickView(e) {
    e.preventDefault();
    props.showQuickView(product._id);
  }

  const offerPrice = (price, offer) => {
    //offer.end_date < current date
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
    <div className="product product-11 text-center">
      <figure className="product-media">
        {combo.new_label ? (
          <span className="product-label label-new">New</span>
        ) : (
          ""
        )}

        {combo.sale_price ? (
          <span className="product-label label-sale">Sale</span>
        ) : (
          ""
        )}

        {combo.top_label ? (
          <span className="product-label label-top">Top</span>
        ) : (
          ""
        )}

        <ALink href={`/product/defaultcombo/${combo._id}`}>
          <LazyLoadImage
            alt="product"
            src={combo.image_url[0]}
            threshold={500}
            style={{ height: "100%" }}
            effect="black and white"
            wrapperClassName="product-image"
          />
          {combo.image2 ? (
            <LazyLoadImage
              alt="product"
              src={combo.image_url[0]}
              threshold={500}
              style={{ height: "100%" }}
              effect="black and white"
              wrapperClassName="product-image-hover"
            />
          ) : (
            ""
          )}
        </ALink>

        <div className="product-action-vertical">
          {isInWishlist(wishlist, combo) ? (
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
      </figure>

      <div className="product-body">
        <div className="product-cat">
          <React.Fragment key={combo.category}>
            <ALink
              href={{
                pathname: "/shop/sidebar/3cols",
                query: { category: combo.category },
              }}
            >
              {combo.category}
            </ALink>
          </React.Fragment>

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
          <ALink href={`/product/defaultcombo/${combo._id}`}>
            {combo.name}
          </ALink>
        </h3>

        <b style={{ display: "inline", color: "#00bd10" }}>
          ${combo.combo_price.toFixed(2)}
          &nbsp;{" "}
        </b>
        <b
          style={{ display: "inline", color: "#00bd10" }}
          className="product-price"
        >
          <span style={{ textDecoration: "line-through", color: "red" }}>
            ${combo.total.toFixed(2)}
          </span>
        </b>

        <div className="ratings-container">
          <div className="ratings">
            <div
              className="ratings-val"
              style={{ width: combo.avg_rating * 20 + "%" }}
            ></div>
            <span className="tooltip-text">{combo.avg_rating.toFixed(1)}</span>
          </div>
          <span className="ratings-text">( Reviews )</span>
        </div>
      </div>

      <div className="product-action">
        {
          <ALink
            className="btn-product "
            href={`/product/defaultcombo/${combo._id}`}
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
})(ProductTwelveCombo);
