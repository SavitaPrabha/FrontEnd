import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import StickyBox from "react-sticky-box";

import ALink from "~/components/features/alink";
import PageHeader from "~/components/features/page-header";
import ShopListOneCombo from "./shop-list-one-combo";
import Pagination from "~/components/features/pagination";
import ShopSidebarOne from "~/components/partials/shop/sidebar/shop-sidebar-one";

import withApollo from "~/server/apollo";
import { GET_PRODUCTS } from "~/server/queries";
import { scrollToPageContent } from "~/utils";
import { postSubmitForm } from "~/helpers/forms_helper";

function Ecombo() {
     let error = false;
     const router = useRouter();
     const type = router.query.type;
     const query = router.query;
     // const [getProducts, { data, loading, error }] = useLazyQuery(GET_PRODUCTS);
     const getProducts = async (variables) => {
          //console.log("getproducts");
          let url = process.env.NEXT_PUBLIC_SERVER_URL + "/combos/combo_by_filter";
          console.log(variables);
          const response = await postSubmitForm(url, { variables: variables });
          if (response && response.status === 1) {
               console.log(response.data);
               setProducts(response.data);

               setLoading(false);
          } else {
               setLoading(true);
          }
     };
     const [firstLoading, setFirstLoading] = useState(false);
     const [perPage, setPerPage] = useState(5);
     const [pageTitle, setPageTitle] = useState("List");
     const [toggle, setToggle] = useState(false);
     // const products = data && data.products.data;
     const [products, setProducts] = useState([]);
     const [loading, setLoading] = useState(true);
     const totalCount = products && products.length;

     useEffect(() => {
          window.addEventListener("resize", resizeHandle);
          resizeHandle();
          return () => {
               window.removeEventListener("resize", resizeHandle);
          };
     }, []);

     function resizeHandle() {
          if (document.querySelector("body").offsetWidth < 992) setToggle(true);
          else setToggle(false);
     }

     useEffect(() => {
          getProducts({
               size: query.size ? [query.size] : [],
               name: query.name || "",
               sub_category: query.sub_category || "",
               searchTerm: query.searchTerm || "",
               category: query.category || "",
               color: query.color ? query.color.split(",") : [] || "",
               max_price: parseInt(query.minPrice) || "",
               min_price: parseInt(query.minPrice) || "",
               new_label: query.new || "",
               top_label: query.top || "",
               is_online: query.is_online || "",
               sort: query.sortBy ? query.sortBy : "default" || "",


               // "searchTerm":"",
               // "name":"  ",
               // "category":"Bedroom",
               // "sub_category":"           ",
               // "color":[],
               // "max_price":"",
               // "min_price":"",
               // "size":[],
               // "top_label":"",
               // "new_label":"",
               // "sort":"",
               // "is_online":""

               // page: query.page ? parseInt(query.page) : 1,
               // perPage: perPage,
               // list: true,
          });

          scrollToPageContent();
     }, [query, perPage]);

     useEffect(() => {
          if (products) setFirstLoading(true);
     }, [products]);

     useEffect(() => {
          if (type == "list") {
               setPageTitle("List");
               setPerPage(5);
          } else if (type == "2cols") {
               setPageTitle("Grid 2 Columns");
               setPerPage(6);
          } else if (type == "3cols") {
               setPageTitle("Grid 3 Columns");
               setPerPage(9);
          } else if (type == "4cols") {
               setPageTitle("Grid 4 Columns");
               setPerPage(12);
          }
     }, [type]);

     function onSortByChange(e) {
          let queryObject = router.query;
          let url = router.pathname.replace("[type]", query.type) + "?";
          for (let key in queryObject) {
               if (key !== "type" && key !== "sortBy") {
                    url += key + "=" + queryObject[key] + "&";
               }
          }

          router.push(url + "sortBy=" + e.target.value);
     }

     function toggleSidebar() {
          if (
               document.querySelector("body").classList.contains("sidebar-filter-active")
          ) {
               document.querySelector("body").classList.remove("sidebar-filter-active");
          } else {
               document.querySelector("body").classList.add("sidebar-filter-active");
          }
     }

     function hideSidebar() {
          document.querySelector("body").classList.remove("sidebar-filter-active");
     }

     if (error) {
          return <div></div>;
     }

     return (
          <main className="main shop">
               {/* <PageHeader title={pageTitle} subTitle="Shop" /> */}
               <nav className="breadcrumb-nav mb-2">
                    <div className="container">
                         <ol className="breadcrumb">
                              <li className="breadcrumb-item">
                                   <ALink href="/">Home</ALink>
                              </li>
                              <li className="breadcrumb-item">
                                   <ALink href="/shop/combo">Shop</ALink>
                              </li>
                              {/* <li className="breadcrumb-item active">{pageTitle}</li> */}
                              {query.search ? (
                                   <li className="breadcrumb-item">
                                        <span>Search - {query.searchTerm}</span>
                                   </li>
                              ) : (
                                   ""
                              )}
                         </ol>
                    </div>
               </nav>

               <div className="page-content">
                    <div className="container">
                         <div className="row skeleton-body">
                              <div
                                   className={`col-lg-9 skel-shop-products ${!loading ? "loaded" : ""
                                        }`}
                              >
                                   <div className="toolbox">
                                        <div className="toolbox-left">
                                             {!loading && products ? (
                                                  <div className="toolbox-info">
                                                       Showing
                                                       <span>
                                                            {" "}
                                                            {products.length} of {totalCount}
                                                       </span>{" "}
                                                       Combos
                                                  </div>
                                             ) : (
                                                  ""
                                             )}
                                        </div>

                                        <div className="toolbox-right">
                                             <div className="toolbox-sort">
                                                  <label htmlFor="sortby">Sort by:</label>
                                                  <div className="select-custom">
                                                       <select
                                                            name="sortby"
                                                            id="sortby"
                                                            className="form-control"
                                                            onChange={onSortByChange}
                                                            value={query.sortBy ? query.sortBy : "default"}
                                                       >
                                                            <option value="default">Default</option>
                                                            <option value="ratings">Most Rated</option>
                                                            <option value="price-low-to-high">
                                                                 Price Low to High
                                                            </option>
                                                            <option value="price-high-to-low">
                                                                 Price High to Low
                                                            </option>
                                                       </select>
                                                  </div>
                                             </div>
                                             {/* <div className="toolbox-layout">
                    <ALink
                      href="/shop/sidebar/3cols"
                      className={`btn-layout ${type == "list" ? "active" : ""}`}
                      scroll={false}
                    >
                      <svg width="16" height="10">
                        <rect x="0" y="0" width="4" height="4" />
                        <rect x="6" y="0" width="10" height="4" />
                        <rect x="0" y="6" width="4" height="4" />
                        <rect x="6" y="6" width="10" height="4" />
                      </svg>
                    </ALink>

                    <ALink
                      href="/shop/sidebar/2cols"
                      className={`btn-layout ${
                        type == "2cols" ? "active" : ""
                      }`}
                      scroll={false}
                    >
                      <svg width="10" height="10">
                        <rect x="0" y="0" width="4" height="4" />
                        <rect x="6" y="0" width="4" height="4" />
                        <rect x="0" y="6" width="4" height="4" />
                        <rect x="6" y="6" width="4" height="4" />
                      </svg>
                    </ALink>

                    <ALink
                      href="/shop/sidebar/3cols"
                      className={`btn-layout ${
                        type == "3cols" ? "active" : ""
                      }`}
                      scroll={false}
                    >
                      <svg width="16" height="10">
                        <rect x="0" y="0" width="4" height="4" />
                        <rect x="6" y="0" width="4" height="4" />
                        <rect x="12" y="0" width="4" height="4" />
                        <rect x="0" y="6" width="4" height="4" />
                        <rect x="6" y="6" width="4" height="4" />
                        <rect x="12" y="6" width="4" height="4" />
                      </svg>
                    </ALink>

                    <ALink
                      href="/shop/sidebar/4cols"
                      className={`btn-layout ${
                        type == "4cols" ? "active" : ""
                      }`}
                      scroll={false}
                    >
                      <svg width="22" height="10">
                        <rect x="0" y="0" width="4" height="4" />
                        <rect x="6" y="0" width="4" height="4" />
                        <rect x="12" y="0" width="4" height="4" />
                        <rect x="18" y="0" width="4" height="4" />
                        <rect x="0" y="6" width="4" height="4" />
                        <rect x="6" y="6" width="4" height="4" />
                        <rect x="12" y="6" width="4" height="4" />
                        <rect x="18" y="6" width="4" height="4" />
                      </svg>
                    </ALink>
                  </div> */}
                                        </div>
                                   </div>

                                   <ShopListOneCombo
                                        products={products}
                                        perPage={perPage}
                                        loading={loading}
                                   ></ShopListOneCombo>

                                   {totalCount > perPage ? (
                                        <Pagination perPage={perPage} total={totalCount}></Pagination>
                                   ) : (
                                        ""
                                   )}
                              </div>

                              <aside
                                   className={`col-lg-3 skel-shop-sidebar order-lg-first skeleton-body ${!loading || firstLoading ? "loaded" : ""
                                        }`}
                              >
                                   <div className="skel-widget"></div>
                                   <div className="skel-widget"></div>
                                   <div className="skel-widget"></div>
                                   <div className="skel-widget"></div>
                                   <StickyBox className="sticky-content" offsetTop={70}>
                                        <ShopSidebarOne toggle={toggle}></ShopSidebarOne>
                                   </StickyBox>
                                   {toggle ? (
                                        <button
                                             className="sidebar-fixed-toggler"
                                             onClick={toggleSidebar}
                                        >
                                             <i className="icon-cog"></i>
                                        </button>
                                   ) : (
                                        ""
                                   )}
                                   <div
                                        className="sidebar-filter-overlay"
                                        onClick={hideSidebar}
                                   ></div>
                              </aside>
                         </div>
                    </div>
               </div>
          </main>
     );
}

// export default withApollo({ ssr: typeof window == "undefined" })(ShopGrid);
export default React.memo(Ecombo);
