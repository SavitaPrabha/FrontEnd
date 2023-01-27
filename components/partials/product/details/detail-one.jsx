import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import SlideToggle from "react-slide-toggle";
import {
  AvForm,
  AvField,
  AvRadioGroup,
  AvRadio,
} from "availity-reactstrap-validation";
import ALink from "~/components/features/alink";
import Qty from "~/components/features/qty";

import { actions as wishlistAction } from "~/store/wishlist";
import { actions as cartAction } from "~/store/cart";

import { canAddToCart, isInWishlist } from "~/utils";
import { Col } from "reactstrap";
import { set } from "store/dist/store.modern.min";
import moment from "moment";

function DetailOne(props) {
  // console.log("props", props);
  const router = useRouter();
  const ref = useRef(null);
  const { product, setProduct } = props;
  const [qty, setQty] = useState(1);
  const [qty2, setQty2] = useState(1);
  const [colorArray, setColorArray] = useState([]);
  const [sizeArray, setSizeArray] = useState([]);
  const [variationGroup, setVariationGroup] = useState([]);
  const [selectedOffer, setselectedOffer] = useState();
  const [selectedVariant, setSelectedVariant] = useState({
    color: "",
    is_online: false,
    variantPrice: "",
    size: "",
  });
  const [showClear, setShowClear] = useState(false);
  const [showVariationPrice, setShowVariationPrice] = useState(false);

  const [maxPrice, setMaxPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [productImages, setproducImages] = useState([]);
  const [color, setcolor] = useState("");
  const [size, setSize] = useState("");
  const [variant, setVariant] = useState("");
  const [rootProduct, setrootProduct] = useState(product);

  // if (variant === "") {
  //   setVariant(product && product.variant_details[0]);
  // }
  const PRODUCT_KEYS = [
    "category",
    "sub_category",
    // "color",
    "weight",
    // "dimensions",
    "assembly_charges",
  ];
  const PRODUCT_TITLE = {
    category: "Category",
    sub_category: "Sub Category",
    // color: "Color",
    weight: "Weight",
    // dimensions: "Dimensions",
    assembly_charges: "Assembly Charges",
  };
  // useEffect(async () => {
  //   window.addEventListener("scroll", scrollHandler, {
  //     passive: true,
  //   });
  //   if (product) {
  //     const price = await updatePrice();
  //     let newProduct = {
  //       ...product,
  //       name: product.name,
  //       //mrp: parseFloat(variant.variantPrice),
  //       color: variant.variantColor,
  //       offer: variant.offer,
  //       //offerPrice: offerPrice(parseFloat(variant.variantPrice), variant.offer),
  //       price: price,
  //       weight: variant.weight,
  //       size: variant.variantSize,
  //       imageUrls: product.variant_details[0].variantImgUrl,
  //       assembly_charges: variant.assembly_charges,
  //       is_online: variant.is_online,
  //     };
  //     console.log(newProduct, "product");
  //     setrootProduct(newProduct);
  //     setselectedOffer(newProduct.offer);
  //     setProduct(newProduct);
  //   }

  //   loadVariantDetails();
  //   return () => {
  //     window.removeEventListener("scroll", scrollHandler);
  //   };
  // }, []);
  // useEffect(() => {
  //   setVariantDetails();
  // }, [color, size]);

  // useEffect(() => {
  //   let min = minPrice;
  //   let max = maxPrice;
  //   min =
  //     product && variant.offer
  //       ? offerPrice(parseFloat(variant.variantPrice), variant.offer)
  //       : undefined; //Setting root image initially
  //   max = product && variant.variantPrice ? variant.variantPrice : ""; //Setting root image initially
  //   if (min) {
  //     setMinPrice(min);
  //   } else setMinPrice(max);
  //   setMaxPrice(max);
  //   if (product && variant && variant.offer) setselectedOffer(variant.offer);
  //   console.log(minPrice, maxPrice, "price");
  //   if (variant === "") {
  //     setVariant(product && product.variant_details[0]);
  //   }
  // }, [product]);

  // useEffect(() => {
  //   setSelectedVariant({
  //     color: null,
  //     colorName: null,
  //     variantPrice: null,
  //     size: "",
  //     is_online: false,
  //   });
  //   setQty(1);
  //   setQty2(1);
  // }, [router.query.slug]);

  // useEffect(() => {
  //   refreshSelectableGroup();
  // }, [variationGroup, selectedVariant]);

  // useEffect(() => {
  //   scrollHandler();
  // }, [router.pathname]);

  // useEffect(() => {
  //   setShowClear(
  //     selectedVariant.color || selectedVariant.size != "" ? true : false
  //   );
  //   setShowVariationPrice(
  //     selectedVariant.color && selectedVariant.size != "" ? true : false
  //   );
  //   let toggle =
  //     ref && ref.current
  //       ? ref.current.querySelector(".variation-toggle")
  //       : false;

  //   if (toggle) {
  //     if (
  //       selectedVariant.color &&
  //       selectedVariant.size != "" &&
  //       toggle.classList.contains("collapsed")
  //     ) {
  //       toggle.click();
  //     }

  //     if (
  //       !(selectedVariant.color && selectedVariant.size != "") &&
  //       !toggle.classList.contains("collapsed")
  //     ) {
  //       toggle.click();
  //     }
  //   }
  // }, [selectedVariant]);

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
  function scrollHandler() {
    if (router.pathname.includes("/product/default")) {
      let stickyBar = ref?.current?.querySelector(".sticky-bar");
      if (stickyBar) {
        if (
          stickyBar.classList.contains("d-none") &&
          ref.current.getBoundingClientRect().bottom < 0
        ) {
          stickyBar.classList.remove("d-none");
          return;
        }
        if (
          !stickyBar.classList.contains("d-none") &&
          ref.current.getBoundingClientRect().bottom > 0
        ) {
          stickyBar.classList.add("d-none");
        }
      }
    }
  }
  function onWishlistClick(e) {
    e.preventDefault();
    if (!isInWishlist(props.wishlist, product)) {
      props.addToWishlist(product);
    } else {
      router.push("/pages/wishlist");
    }
  }
  function refreshSelectableGroup() {
    let tempArray = [...variationGroup];
    if (selectedVariant.color) {
      tempArray = variationGroup.reduce((acc, cur) => {
        if (selectedVariant.color !== cur.color) {
          return acc;
        }
        return [...acc, cur];
      }, []);
    }

    tempArray = [...variationGroup];
    if (selectedVariant.size) {
      tempArray = variationGroup.reduce((acc, cur) => {
        if (selectedVariant.size !== cur.size) {
          return acc;
        }
        return [...acc, cur];
      }, []);
    }
  }
  function onChangeQty(current) {
    setQty(current);
  }
  function onChangeQty2(current) {
    setQty2(current);
  }
  function clearSelection(e) {
    e.preventDefault();
    setSelectedVariant({
      ...selectedVariant,
      color: null,
      colorName: null,
      size: "",
    });
    refreshSelectableGroup();
  }
  const onCartClick = async (e, index = 0) => {
    e.preventDefault();
    if (e.currentTarget.classList.contains("btn-disabled")) return;

   
    let newProduct = { ...product };

    newProduct = {
      ...product,
      name: product.name,
      category:product.category,
      price: product.price,
      
    };
    console.log("newProduct", newProduct);
    props.addToCart(newProduct, index == 0 ? qty : qty2);
  };

  // const loadVariantDetails = () => {
  //   console.log("variant loaded");
  //   let variant_details = new Array();
  //   let sizes = [];
  //   // setcolor(variant.variantColor || "");
  //   setSize(variant.variantSize || "");
  //   if (product) {
  //     if (variant === "") {
  //       setColorArray(product && product.variant_details[0]);
  //     } else if (product.variant_details && product.variant_details.length) {
  //       product.variant_details.forEach((ele) => {
  //         if (
  //           ele._id &&
  //           variant_details.filter((c) => c == ele._id).length == 0
  //         )
  //           variant_details.push(ele._id);
  //         // if (ele.variantSize && ele.variantSize != "" && sizes.filter(c => c == ele.variantSize).length == 0) sizes.push(ele.variantSize);
  //       });
  //     }
  //     if (variant_details.length) setColorArray(variant_details);
  //     console.log(colorArray, sizeArray);
  //     if (sizes && sizes.length) setSizeArray(sizes);
  //   }
  // };

  // const updatePrice = async () => {
  //   const variant_obj = JSON.parse(JSON.stringify(variant));
  //   if (
  //     variant_obj.offer &&
  //     variant_obj.offer.discount_value &&
  //     moment(variant_obj.offer.start_date).isBefore(moment()) &&
  //     moment(variant_obj.offer.end_date).isAfter(moment())
  //   ) {
  //     if (variant_obj.offer.discount_type === "Percent") {
  //       const offer_price =
  //         ((100 - variant_obj.offer.discount_value) / 100) *
  //         variant_obj.variantPrice;

  //       return Number(offer_price.toFixed(0));
  //     } else if (variant_obj.offer.discount_type === "Flat") {
  //       const offer_price =
  //         variant_obj.variantPrice - variant_obj.offer.discount_value;

  //       return offer_price;
  //     }
  //   } else {
  //     return variant_obj.variantPrice;
  //   }
  // };

  // const setVariantDetails = () => {
  //   // console.log(color,size,rootProduct)
  //   if (product) {
  //     if (rootProduct && rootProduct.color && rootProduct.color == color) {
  //       setProduct(rootProduct);
  //       return;
  //     } else if (product.variant_details && product.variant_details.length) {
  //       let variantdetail = product.variant_details.find((ele) => {
  //         if (ele._id == color) return true;
  //       });

  //       if (variantdetail && Object.keys(variantdetail).length) {
  //         // variantdetail.size &&  variantdetail.size !==''?setSize(variantdetail.size): setSize('')
  //         // variantdetail.color &&  variantdetail.color !==''?setcolor(variantdetail.color):setcolor('')
  //         setSize(variantdetail);
  //         if (variant === "") {
  //           setVariant(product && product.variant_details[0]);
  //         }
  //         setVariant(variantdetail);
  //         let updatedPrice = variantdetail.variantPrice || 0;
  //         let newProduct = {
  //           ...product,
  //           name: product.name,
  //           price: parseFloat(updatedPrice),
  //           offerPrice: offerPrice(
  //             parseFloat(updatedPrice),
  //             variantdetail.offer
  //           ),
  //           weight: variantdetail.weight,
  //           color: variantdetail.variantColor,
  //           size: variantdetail.variantSize,
  //           offers: variantdetail.offers,
  //           imageUrls: variantdetail.variantImgUrl,
  //           assembly_charges: variantdetail.assembly_charges,
  //           is_online: variantdetail.is_online,
  //         };
  //         console.log(newProduct);
  //         setProduct(newProduct);
  //       }
  //     }
  //   }
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
  // if (!product) {
  //   return <div></div>;
  // }

  return (
    <div className="product-details" ref={ref}>
      <h1 className="product-title">{product.name}</h1>

      <div className="ratings-container">
        {/* <div className="ratings">
          <div
            className="ratings-val"
            style={{ width: product.ratings * 20 + "%" }}
          ></div>
          <span className="tooltip-text">{product.ratings.toFixed(1)}</span>
        </div> */}
        {/* <span className="ratings-text">( {product.reviews} Reviews )</span> */}
      </div>
      <div className="product-price mt-1" style={{ display: "inline" }}>
           
           <b className="discount-value " style={{ color: "#00bd10" }}>
           ${product.price.toFixed(2)}
           </b>
         </div>

      <div className="product-content">
        <p>{product.highlights}</p>
      </div>

      <div className="details-filter-row details-row-size">
        <label htmlFor="qty">Qty:</label>
        <Qty changeQty={onChangeQty} value={qty}></Qty>
      </div>

      <div className="details-filter-row details-row-size">
        <label htmlFor="size">Variant:</label>
{/*   
        <Col className="m-0 p-0">
          <select
            className="product-dropdown"
            value={color}
            onChange={(e) => setcolor(e.target.value)}
          >
            {product &&
              product.variant_details.map((r) => (
                <option key={r._id} value={r._id}>
                  {console.log(variant, "hbjbsadhj")}
                  {`${r.variantColor && r.variantColor}----${
                    r.variantSize && r.variantSize
                  }`}
                </option>
              ))}
          </select>
        </Col> */}
{/* 
        {colorArray && colorArray.length ? (
          <Col className="m-0 p-0" md={6}>
            <label htmlFor="color">Color:</label>
            <select
              className="product-dropdown"
              value={color}
              onChange={(e) =>
                e.target.value ? setcolor(e.target.value) : setcolor("")
              }
            >
              <option key={0} value="">Select Color</option>
              {colorArray.map((ele, idx) => {
                return (
                  <option key={`${idx + 1}-${ele}`} value={ele}>
                    {ele}
                  </option>
                );
              })}
            </select>
          </Col>
        ) : (
          ""
        )}  */}
      </div>
      <div className="product-details-action">
        <a
          href="#"
          className={`btn-product btn-cart ${
            !canAddToCart(props.cartlist, product, qty) ? "btn-disabled" : ""
          }`}
          onClick={(e) => onCartClick(e, 0)}
        >
          <span>add to cart</span>
        </a>

        <div className="details-action-wrapper">
          {isInWishlist(props.wishlist, product) ? (
            <ALink
              href="/shop/wishlist"
              className="btn-product btn-wishlist added-to-wishlist"
            >
              <span>Go to Wishlist</span>
            </ALink>
          ) : (
            <a
              href="#"
              className="btn-product btn-wishlist"
              onClick={onWishlistClick}
            >
              <span>Add to Wishlist</span>
            </a>
          )}
        </div>
      </div>

      <div className="product-details-footer">
        <div className="product-cat w-100 text-truncate">
          {PRODUCT_KEYS.map((ele, idx) => {
            return (
              <div key={idx}>
                <span>{PRODUCT_TITLE[`${ele}`]}:</span>
                <span>{product[`${ele}`]}</span>
              </div>
            );
          })}
        </div>
        {product.tentative_delivery_message ? (
          <div className="product-cat w-100 text-truncate">
            Tentative Delivery Message: {product.tentative_delivery_message}
          </div>
        ) : (
          ""
        )}

        <div className="social-icons social-icons-sm">
          <span className="social-label">Share:</span>
          <a
            target="_blank"
            href={
              "http://www.facebook.com/sharer.php?u=https://grvfurniture.com/product/default/" +
              product._id
            }
            className="social-icon"
            title="Facebook"
          >
            <i className="icon-facebook-f"></i>
          </a>

          <a
            target="_blank"
            href={
              "http://twitter.com/intent/tweet/?url=https://grvfurniture.com/product/default/" +
              product._id
            }
            className="social-icon"
            title="Twitter"
          >
            <i className="icon-twitter"></i>
          </a>
          <a
            target="_blank"
            href={
              "http://pinterest.com/pin/create/button/?url=https://grvfurniture.com/product/default/" +
              product._id
            }
            className="social-icon"
            title="Pinterest"
          >
            <i className="icon-pinterest"></i>
          </a>
        </div>
      </div>

      <div className="sticky-bar d-none">
        <div className="container">
          <div className="row">
            <div className="col-6">
              <figure className="product-media">
                <ALink
                  href={`/product/default/${product._id}`}
                  className="product-image"
                >
                  <img
                    src={
                      product && product.imageUrls ? product.image_url : ""
                    }
                    alt="product"
                  />
                </ALink>
              </figure>
              <h3 className="product-title">
                <ALink href={`/product/default/${product._id}`}>
                  {product.name}
                </ALink>
              </h3>
            </div>
            <div className="col-6 justify-content-end">
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
                  <div className="product-price mt-1">
                    ${minPrice?.toFixed(2)}
                  </div>
                ) : (
                  <div
                    className="product-price mr-1"
                    style={{ display: "inline" }}
                  >
                    <div>
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "gray",
                        }}
                      >
                        ${maxPrice?.toFixed(2)}
                      </span>{" "}
                      {discountedValue()}{" "}
                    </div>
                    <div className="discount-value">${minPrice.toFixed(2)}</div>
                  </div>
                )
              ) : (
                ""
              )}
              <Qty
                changeQty={onChangeQty2}
                //max={product.available}
                value={qty2}
              ></Qty>
              <div className="product-details-action">
                <a
                  href="#"
                  className={`btn-product btn-cart ${
                    !canAddToCart(props.cartlist, product, qty)
                      ? "btn-disabled"
                      : ""
                  }`}
                  onClick={(e) => onCartClick(e, 1)}
                >
                  <span>add to cart</span>
                </a>
                {isInWishlist(props.wishlist, product) ? (
                  <ALink
                    href="/shop/wishlist"
                    className="btn-product btn-wishlist added-to-wishlist"
                  >
                    <span>Go to Wishlist</span>
                  </ALink>
                ) : (
                  <a
                    href="#"
                    className="btn-product btn-wishlist"
                    onClick={onWishlistClick}
                  >
                    <span>Add to Wishlist</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    cartlist: state.cartlist.data,
    wishlist: state.wishlist.data,
  };
};

export default connect(mapStateToProps, { ...wishlistAction, ...cartAction })(
  DetailOne
);
