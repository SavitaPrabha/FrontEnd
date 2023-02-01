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
      product && product.image_url.offer
        ? offerPrice(
            parseFloat(product.image_url.variantPrice),
            product.image_url.offer
          )
        : undefined; //Setting root image initially
    max =
      product && product.image_url.variantPrice
        ? product.image_url.variantPrice
        : ""; //Setting root image initially
    if (min) {
      setMinPrice(min);
    } else setMinPrice(max);
    setMaxPrice(max);
    if (
      product &&
      product.image_url &&
      product.image_url.offer
    )
      setselectedOffer(product.image_url.offer);
  }, []);

  function onCartClick(e) {
    let newProduct = {
      ...product,
      name: product.name,
      mrp: parseFloat(product.image_url.variantPrice),
      color: product.image_url.color,
      offer: product.image_url.offer,
      offerPrice: offerPrice(
        parseFloat(product.image_url.variantPrice),
        product.image_url.offer
      ),
      weight: product.image_url.weight,
      size: product.image_url.size,
      imageUrls: product.image_url.variantImgUrl,
      assembly_charges: product.image_url.assembly_charges,
      is_online: product.image_url.is_online,
    };
    e.preventDefault();

    props.addToCart(newProduct);
  }

  function onWishlistClick(e) {
    let newProduct = {
      ...product,
      name: product.name,
      mrp: parseFloat(product.image_url.variantPrice),
      color: product.image_url.color,
      offer: product.image_url.offer,
      offerPrice: offerPrice(
        parseFloat(product.image_url.variantPrice),
        product.image_url.offer
      ),
      weight: product.image_url.weight,
      size: product.image_url.size,
      imageUrls: product.image_url.variantImgUrl,
      assembly_charges: product.image_url.assembly_charges,
      is_online: product.image_url.is_online,
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
        {/* {product.image_url.offer &&
        product.image_url.offer.name ? (
          <b className="product-label label-square label-offer">
            {product.image_url.offer.name}
          </b>
        ) : (
          ""
        )} */}
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
            src={product.image_url}
            threshold={500}
            effect="black and white"
            wrapperClassName="product-image"
          />
          {product.image2 ? (
            <LazyLoadImage
              alt="product"
              src={product.image_url}
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

        <div className="product-price">
              <span className="out-price">
                
                  <span>${product.price.toFixed(2)}</span>
               
              </span>
            </div>
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
            
          </div>
        
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
