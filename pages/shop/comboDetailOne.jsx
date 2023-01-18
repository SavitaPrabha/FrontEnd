import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import SlideToggle from "react-slide-toggle";

import ALink from "~/components/features/alink";
import Qty from "~/components/features/qty";

import { actions as wishlistAction } from "~/store/wishlist";
import { actions as cartAction } from "~/store/cart";

import { canAddToCart, isInWishlist } from "~/utils";
import { Col } from "reactstrap";
import { set } from "store/dist/store.modern.min";
import BootstrapTable from "react-bootstrap-table-next";
function ComboDetailOne(props) {
  // console.log("props", props);
  const router = useRouter();
  const ref = useRef(null);
  const { product, setProduct } = props;
  console.log(product, "Ashish");
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
  const [minPrice, setMinPrice] = useState(99999);
  const [productImages, setproducImages] = useState([]);
  const [color, setcolor] = useState("");
  const [size, setSize] = useState("");
  const [rootProduct, setrootProduct] = useState(product);

  const updatePrice = async () => {
    const variant_obj = JSON.parse(JSON.stringify(variant));
    if (
      variant_obj.offer &&
      variant_obj.offer.discount_value &&
      moment(variant_obj.offer.start_date).isBefore(moment()) &&
      moment(variant_obj.offer.end_date).isAfter(moment())
    ) {
      if (variant_obj.offer.discount_type === "Percent") {
        const offer_price =
          ((100 - variant_obj.offer.discount_value) / 100) *
          variant_obj.variantPrice;

        return Number(offer_price.toFixed(0));
      } else if (variant_obj.offer.discount_type === "Flat") {
        const offer_price =
          variant_obj.variantPrice - variant_obj.offer.discount_value;

        return offer_price;
      }
    } else {
      return variant_obj.variantPrice;
    }
  };

  // const columns = [
  //      {
  //           dataField: "_id",
  //           hidden: true,
  //      },
  //      {
  //           dataField: "_id",
  //           formatter: (cell, row, rowIndex) => {
  //                return rowIndex + 1;
  //           },
  //           text: "#",
  //           headerStyle: (colum, colIndex) => {
  //                return { width: "5%" };
  //           },
  //      },

  //      {
  //           text: "Product Name",

  //           formatter: (cell, row) => {
  //                let name = "";
  //                row && row.products && row.products.map((item) => {
  //                     name = item.name
  //                });

  //                return name;
  //           },
  //           sort: true,
  //           headerStyle: (colum, colIndex) => {
  //                return { width: "10%" };
  //           },
  //      },

  // ];
  // const PRODUCT_KEYS = [
  //      "category",
  //      "sub_category",
  //      "color",
  //      "weight",
  //      "dimensions",
  //      "assembly_charges",
  // ];
  // const PRODUCT_TITLE = {
  //      category: "Category",
  //      sub_category: "Sub Category",
  //      color: "Color",
  //      weight: "Weight",
  //      dimensions: "Dimensions",
  //      assembly_charges: "Assembly Charges",
  // };
  // useEffect(() => {
  //      window.addEventListener("scroll", scrollHandler, {
  //           passive: true,
  //      });
  //      if (product) {
  //           let newProduct = {
  //                ...product,
  //                name: product.name,
  //                mrp: parseFloat(product.combo_price),
  //                color: product.variant_details[0].variantColor,
  //                offer: product.variant_details[0].offer,
  //                offerPrice: offerPrice(parseFloat(product.variant_details[0].variantPrice), product.variant_details[0].offer),
  //                weight: product.variant_details[0].weight,
  //                size: product.variant_details[0].variantSize,
  //                imageUrls: product.variant_details[0].variantImgUrl,
  //                assembly_charges: product.variant_details[0].assembly_charges,
  //                is_online: product.variant_details[0].is_online

  //           };
  //           // console.log(newProduct)
  //           setrootProduct(newProduct);
  //           setselectedOffer(newProduct.offer);
  //           setProduct(newProduct);
  //      }
  //      loadVariantDetails();
  //      return () => {
  //           window.removeEventListener("scroll", scrollHandler);
  //      };
  // }, []);
  useEffect(() => {
    setVariantDetails();
  }, [color, size]);

  useEffect(() => {
    let min = 99999;
    let max = 0;
    min = product && product.offerPrice ? product.offerPrice : undefined;
    max = product && product.price ? product.price : "";
    console.log(product);

    if (product && product.offer) setselectedOffer(product.offer);
    if (min) {
      setMinPrice(min);
    } else setMinPrice(max);
    setMaxPrice(max);
  }, [product]);

  useEffect(() => {
    setSelectedVariant({
      color: null,
      colorName: null,
      variantPrice: null,
      size: "",
      is_online: false,
    });
    setQty(1);
    setQty2(1);
  }, [router.query.slug]);

  useEffect(() => {
    refreshSelectableGroup();
  }, [variationGroup, selectedVariant]);

  useEffect(() => {
    scrollHandler();
  }, [router.pathname]);

  useEffect(() => {
    setShowClear(
      selectedVariant.color || selectedVariant.size != "" ? true : false
    );
    setShowVariationPrice(
      selectedVariant.color && selectedVariant.size != "" ? true : false
    );
    let toggle =
      ref && ref.current
        ? ref.current.querySelector(".variation-toggle")
        : false;

    if (toggle) {
      if (
        selectedVariant.color &&
        selectedVariant.size != "" &&
        toggle.classList.contains("collapsed")
      ) {
        toggle.click();
      }

      if (
        !(selectedVariant.color && selectedVariant.size != "") &&
        !toggle.classList.contains("collapsed")
      ) {
        toggle.click();
      }
    }
  }, [selectedVariant]);

  const offerPrice = (price, offer) => {
    //offer.end_date < current date
    console.log(price, offer);
    let offerPrice;
    if (offer && offer.type == "Online") {
      if (offer.discount_type && offer.discount_type == "Percent") {
        offerPrice = price - (price * offer.discount_value) / 100;
      } else if (offer.discount_type && offer.discount_type == "Flat") {
        offerPrice = price - offer.discount_value;
      }
    }
    return offerPrice;
  };
  function scrollHandler() {
    if (router.pathname.includes("/product/defaultcombo")) {
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
    const newProduct = {
      ...product,
      name: product.name,
      //mrp: parseFloat(product.combo_price),
      price: price,
      imageUrls: product.image_url,
      assembly_charges: product.assembly_charges,
      is_online: product.is_online,
    };
    e.preventDefault();
    if (!isInWishlist(props.wishlist, newProduct)) {
      props.addToWishlist(newProduct);
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
  function onCartClick(e, index = 0) {
    e.preventDefault();
    if (e.currentTarget.classList.contains("btn-disabled")) return;

    let newProduct = { ...product };
    console.log(newProduct);
    newProduct = {
      ...product,
      name: product.name,
      price: product.combo_price,
      assembly_charges: product.assembly_charges,
      imageUrls: product.image_url,
    };
    props.addToCart(newProduct, index == 0 ? qty : qty2);
  }
  const loadVariantDetails = () => {
    console.log("variant loaded");
    let colors = new Array();
    let sizes = [];
    setcolor(product.variant_details[0].variantColor || "");
    setSize(product.variant_details[0].variantSize || "");
    if (product) {
      if (product.variant_details && product.variant_details.length) {
        product.variant_details.forEach((ele) => {
          if (
            ele.variantColor &&
            ele.variantColor != "" &&
            colors.filter((c) => c == ele.variantColor).length == 0
          )
            colors.push(ele.variantColor);
          if (
            ele.variantSize &&
            ele.variantSize != "" &&
            sizes.filter((c) => c == ele.variantSize).length == 0
          )
            sizes.push(ele.variantSize);
        });
      }
      if (colors.length) setColorArray(colors);
      console.log(colorArray, sizeArray);
      if (sizes && sizes.length) setSizeArray(sizes);
    }
  };

  const setVariantDetails = () => {
    // console.log(color,size,rootProduct)
    if (product) {
      if (
        rootProduct &&
        rootProduct.color &&
        rootProduct.color == color &&
        rootProduct.size == size
      ) {
        setProduct(rootProduct);
        return;
      } else if (product.variant_details && product.variant_details.length) {
        console.log(product);
        let variantdetail = product.variant_details.find((ele) => {
          if (ele.variantColor == color || ele.variantSize == size) return true;
        });

        console.log(variantdetail);
        if (variantdetail && Object.keys(variantdetail).length) {
          // variantdetail.size &&  variantdetail.size !==''?setSize(variantdetail.size): setSize('')
          // variantdetail.color &&  variantdetail.color !==''?setcolor(variantdetail.color):setcolor('')
          setSize(variantdetail.size);
          setcolor(variantdetail.color);
          let updatedPrice = variantdetail.variantPrice || 0;
          let newProduct = {
            ...product,
            name: product.name,
            // mrp: parseFloat(updatedPrice),
            // offerPrice: offerPrice(
            //   parseFloat(updatedPrice),
            //   variantdetail.offer
            // ),
            price: price,
            weight: variantdetail.weight,
            color: variantdetail.variantColor,
            size: variantdetail.variantSize,
            offers: variantdetail.offers,
            imageUrls: variantdetail.variantImgUrl,
            assembly_charges: variantdetail.assembly_charges,
            is_online: variantdetail.is_online,
          };
          console.log(newProduct);
          setProduct(newProduct);
        }
      }
    }
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
  if (!product) {
    return <div></div>;
  }

  return (
    <div className="product-details" ref={ref}>
      <h1 className="product-title">{product.name}</h1>

      <div className="ratings-container">
        <div className="ratings">
          <div
            className="ratings-val"
            style={{ width: product.avg_rating * 20 + "%" }}
          ></div>
          <span className="tooltip-text">{product.avg_rating.toFixed(1)}</span>
        </div>
        <span className="ratings-text">( {product.reviews} Reviews )</span>
      </div>

      <div style={{ display: "inline" }} className="product-price">
        ${product.combo_price.toFixed(2)}
        &nbsp;{" "}
        <span style={{ textDecoration: "line-through", color: "gray" }}>
          ${product.total.toFixed(2)}
        </span>
      </div>

      <div className="product-content">
        {/* <p>{product.description}</p> */}
      </div>

      <div className="details-filter-row details-row-size">
        <label htmlFor="qty">Qty:</label>
        <Qty changeQty={onChangeQty} value={qty}></Qty>
      </div>

      <div className="details-filter-row details-row-size">
        {sizeArray && sizeArray.length ? (
          <Col className="m-0 p-0" md={6}>
            <label htmlFor="size">Size:</label>
            <select
              className="product-dropdown"
              value={size}
              onChange={(e) =>
                e.target.value &&
                e.target.value != "" &&
                setSize(e.target.value)
              }
            >
              <option key={0} value="">
                Select Size
              </option>
              {sizeArray.map((ele, idx) => {
                return (
                  <option key={`${idx + 1}`} value={ele}>
                    {ele}
                  </option>
                );
              })}
            </select>
          </Col>
        ) : (
          ""
        )}
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
              <option key={0} value="">
                Select Color
              </option>
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
        )}
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
          <table class="table table-bordered ">
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Color</th>
              <th>Size</th>
              <th>Qty</th>
            </tr>

            {product &&
              product.products.map((val, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{val.name}</td>
                    <td>{val.variant_details.variantColor}</td>
                    <td>{val.variant_details.variantSize}</td>
                    <td>{val.qty}</td>
                  </tr>
                );
              })}
          </table>
          <hr />
        </div>

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
                <ALink href={`/product/default/${product.slug}`}>
                  <img
                    src={product.image1}
                    alt="product"
                    width={300}
                    height={300}
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
              <div style={{ display: "inline" }} className="product-price">
                ${product.combo_price.toFixed(2)}
                &nbsp;{" "}
                <span style={{ textDecoration: "line-through", color: "gray" }}>
                  ${product.total.toFixed(2)}
                </span>
              </div>
              <Qty
                changeQty={onChangeQty2}
                max={product.available}
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
  ComboDetailOne
);
