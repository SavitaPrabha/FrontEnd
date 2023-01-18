import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";

import withApollo from "~/server/apollo";
import { GET_PRODUCT } from "~/server/queries";

import Breadcrumb from "~/components/partials/product/breadcrumb";
import GalleryDefault from "~/components/partials/product/gallery/gallery-default";
import DetailOne from "~/components/partials/product/details/detail-one";
import InfoOne from "~/components/partials/product/info-tabs/info-one";
import RelatedProductsOne from "~/components/partials/product/related/related-one";
import { postSubmitForm } from "~/helpers/forms_helper";

function ProductDefault() {
  const id = useRouter().query.slug;

  if (!id) return <div></div>;

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
      let url = process.env.NEXT_PUBLIC_SERVER_URL + "/product_by_id";
      const response = await postSubmitForm(url, { id });
      // console.log(response.data)
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

                {!loading ? <GalleryDefault setProduct={setProduct} product={product} /> : ""}
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
                {!loading ? <DetailOne  setProduct={setProduct} product={product} /> : ""}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="skel-pro-tabs"></div>
          ) : (
            <InfoOne product={product} />
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
export default React.memo(ProductDefault);
