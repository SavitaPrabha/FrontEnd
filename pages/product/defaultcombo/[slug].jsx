import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";

import withApollo from "~/server/apollo";
import { GET_PRODUCT } from "~/server/queries";

import Breadcrumb from "~/components/partials/product/breadcrumb";

import GalleryDefaultCombo from "~/pages/shop/galleryCombo/gallery-default";
import ComboDetailOne from "~/pages/shop/comboDetailOne";
import InfoOne from "~/components/partials/product/info-tabs/info-one";
import RelatedProductsOne from "~/components/partials/product/related/related-one";
import { postSubmitForm } from "~/helpers/forms_helper";
import InfoOneCombo from "~/pages/shop/info-one-combo";



function ProductDefaultCombo() {
  const combo_id = useRouter().query.slug;

  if (!combo_id) return <div></div>;

  // const { data, loading, error } = useQuery(GET_PRODUCT, {
  //   variables: { slug },
  // });
  // const product = data && data.product.single;
  // const related = data && data.product.related;
  // const prev = data && data.product.prev;
  // const next = data && data.product.next;

  let error = false;

  const [product, setProduct] = useState(),
    [loading, setLoading] = useState(true),
    [relatedProducts, setRelatedProducts] = useState([]);

  const getProduct = async () => {
    try {
      let url = "https://api-grv.onebigbit.com/combos/combo_by_id";
      const response = await postSubmitForm(url, { combo_id });
      console.log(response.data)
      setProduct(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  if (error) {
    return <div>error</div>;
  }

  return (
    <div className="main">
      <Breadcrumb prev={null} next={null} current="Default" />

      <div className="page-content">
        <div className="container skeleton-body">
          <div className="product-details-top">
            <div className={`row skel-pro-single ${loading ? "" : "loaded"}`}>
              <div className="col-md-6">
                <div className="skel-product-gallery"></div>

                {!loading ? <GalleryDefaultCombo setProduct={setProduct} product={product} /> : ""}
              </div>

              <div className="col-md-6">
                <div className="entry-summary row">
                  <div className="col-md-12">
                    <div className="entry-summary1 mt-2 mt-md-0"></div>
                  </div>
                  <div className="col-md-12">
                    <div className="entry-summary2"></div>
                  </div>
                </div>
                {!loading ? <ComboDetailOne setProduct={setProduct} product={product} /> : ""}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="skel-pro-tabs"></div>
          ) : (
            <InfoOneCombo product={product} />
          )}

          {/* <RelatedProductsOne products={relatedProducts} loading={loading} /> */}
        </div>
      </div>
    </div>
  );
}

// export default withApollo({ ssr: typeof window == "undefined" })(
//   ProductDefault
// );
export default React.memo(ProductDefaultCombo);
