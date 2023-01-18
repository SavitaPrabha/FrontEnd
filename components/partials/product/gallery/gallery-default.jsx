import { Magnifier } from "react-image-magnifiers";
import React, { useState, useEffect } from "react";
import LightBox from "react-image-lightbox";

function GalleryDefault(props) {
  const { product, adClass = "product-gallery-vertical" } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [selectedImage, setselectedImage] = useState("");

  useEffect(() => {
    if (product) {
      setIsOpen(false);
      setPhotoIndex(0);
      let productColor = product.color;
      console.log(productColor);
      if (product && product.imageUrls) setselectedImage(product.imageUrls[0]);
    }
  }, [product]);

  function moveNextPhoto() {
    setPhotoIndex((photoIndex + 1) % 2);
  }

  function movePrevPhoto() {
    setPhotoIndex((photoIndex + 2 - 1) % 2);
  }

  function openLightBox() {
    let index = parseInt(
      document.querySelector(".product-main-image").getAttribute("index")
    );

    if (!index) {
      index = 0;
    }
    setIsOpen(true);
    setPhotoIndex(index);
  }

  function closeLightBox() {
    setIsOpen(false);
  }

  function changeBgImage(e, image, index) {
    let imgs = document.querySelectorAll(".product-main-image img");
    for (let i = 0; i < imgs.length; i++) {
      imgs[i].src = image;
    }

    document
      .querySelector(".product-image-gallery .active")
      .classList.remove("active");

    document.querySelector(".product-main-image").setAttribute("index", index);
    e.currentTarget.classList.add("active");
  }

  if (!product) {
    return <div></div>;
  }

  return (
    <>
      <div className={`product-gallery ${adClass}`}>
        <div className="row m-0">
          <figure className="product-main-image" index="0">
            {product.new_label ? (
              <span className="product-label label-new">New</span>
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

            <Magnifier
              imageSrc={selectedImage}
              imageAlt="product"
              largeImageSrc={selectedImage} // Optional
              dragToMove={false}
              mouseActivation="hover"
              cursorStyleActive="crosshair"
              id="product-zoom"
              className="zoom-image position-relative overflow-hidden"
              width={800}
              minHeight={800}
              style={{
                paddingTop: `${68}%`,
                minHeight: "100%",
              }}
            />

            <button
              id="btn-product-gallery"
              className="btn-product-gallery"
              onClick={openLightBox}
            >
              <i className="icon-arrows"></i>
            </button>
          </figure>

          <div id="product-zoom-gallery" className="product-image-gallery">
            {product &&
              product.imageUrls &&
              product.imageUrls.map((ele, idx) => {
                return (
                  <button
                    className={`product-gallery-item active`}
                    key={`${product.id}-${idx}`}
                    onClick={(e) => {
                      setselectedImage(ele);
                      changeBgImage(e, `${ele}`, 0);
                    }}
                  >
                    <div className="img-wrapper h-100">
                      <img src={ele} alt={`product image -${idx}`} />
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {isOpen ? (
        <LightBox
          mainSrc={
            product.imageUrls && product.imageUrls.length
              ? product.imageUrls[photoIndex]
              : ""
          }
          nextSrc={product.imageUrls[photoIndex + 1]}
          prevSrc={product.imageUrls[photoIndex > 0 ? photoIndex - 1 : 0]}
          onCloseRequest={closeLightBox}
          onMovePrevRequest={moveNextPhoto}
          onMoveNextRequest={movePrevPhoto}
          reactModalStyle={{
            overlay: {
              zIndex: 1041,
            },
          }}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default React.memo(GalleryDefault);
