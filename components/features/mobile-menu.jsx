import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import SlideToggle from "react-slide-toggle";
import { postSubmitForm } from "~/helpers/forms_helper";
import ALink from "~/components/features/alink";

function MobileMenu() {
  const router = useRouter();
  const query = useRouter().query;
  const [searchTerm, setSearchTerm] = useState("");
  const [productCategories, setProductCategories] = useState([]);
  useEffect(() => {
    router.events.on("routeChangeComplete", hideMobileMenu);
  }, []);

  const loadProductCategories = async () => {
    let url = process.env.NEXT_PUBLIC_SERVER_URL + "/productcategory/getall";
    const response = await postSubmitForm(url, null);

    setProductCategories(response.data);
  };
  //console.log(productCategories, "category");
  useEffect(() => {
    loadProductCategories();
  }, []);
  function hideMobileMenu() {
    document.querySelector("body").classList.remove("mmenu-active");
  }

  function onSearchChange(e) {
    setSearchTerm(e.target.value);
  }

  function onSubmitSearchForm(e) {
    e.preventDefault();
    router.push({
      pathname: "/shop/sidebar/3cols",
      query: {
        searchTerm: searchTerm,
        category: "",
      },
    });
  }

  return (
    <div className="mobile-menu-container mobile-menu-light">
      <div className="mobile-menu-wrapper">
        <span className="mobile-menu-close" onClick={hideMobileMenu}>
          <i className="icon-close"></i>
        </span>

        <form
          action="#"
          method="get"
          onSubmit={onSubmitSearchForm}
          className="mobile-search"
        >
          <label htmlFor="mobile-search" className="sr-only">
            Search
          </label>
          <input
            type="text"
            className="form-control"
            value={searchTerm}
            onChange={onSearchChange}
            name="mobile-search"
            id="mobile-search"
            placeholder="Search product ..."
            required
          />
          <button className="btn btn-primary" type="submit">
            <i className="icon-search"></i>
          </button>
        </form>

        <Tabs defaultIndex={0} selectedTabClassName="show">
          <TabList className="nav nav-pills-mobile" role="tablist">
            <Tab className="nav-item text-center">
              <span className="nav-link">Menu</span>
            </Tab>

            <Tab className="nav-item text-center">
              <span className="nav-link">Categories</span>
            </Tab>
          </TabList>

          <div className="tab-content">
            <TabPanel>
              <nav className="mobile-nav">
                <ul className="mobile-menu">
                  <SlideToggle collapsed={true}>
                    {({ onToggle, setCollapsibleElement, toggleState }) => (
                      <li
                        className={
                          toggleState.toLowerCase() == "expanded" ? "open" : ""
                        }
                      >
                        <ALink href="/shop/sidebar/3cols?page=1&new=true">
                          {" "}
                          New Arrivals
                        </ALink>
                      </li>
                    )}
                  </SlideToggle>
                  <SlideToggle collapsed={true}>
                    {({ onToggle, setCollapsibleElement, toggleState }) => (
                      <li
                        className={
                          toggleState.toLowerCase() == "expanded" ? "open" : ""
                        }
                      >
                        <ALink href="/"> Deals & Promotions</ALink>
                      </li>
                    )}
                  </SlideToggle>
                  {/* <SlideToggle collapsed={true}>
                    {({ onToggle, setCollapsibleElement, toggleState }) => (
                      <li
                        className={
                          toggleState.toLowerCase() == "expanded" ? "open" : ""
                        }
                      >
                        <ALink href="/shop/sidebar/3cols">
                          Top Categories
                          <span
                            className="mmenu-btn"
                            onClick={(e) => {
                              onToggle(e);
                              e.preventDefault();
                            }}
                          ></span>
                        </ALink>

                        <ul ref={setCollapsibleElement}>
                          <li>
                            <ALink href="/shop/sidebar/3cols?category=Bedroom">
                              Bed Room
                            </ALink>
                          </li>
                          <li>
                            <ALink href="/shop/sidebar/3cols?category=Dining+Room">
                              Dining Room
                            </ALink>
                          </li>
                          <li>
                            <ALink href="/shop/sidebar/3cols?category=Living+Room">
                              Living Room
                            </ALink>
                          </li>
                        </ul>
                      </li>
                    )}
                  </SlideToggle> */}
                </ul>
              </nav>
            </TabPanel>
            <TabPanel>
              <nav className="mobile-nav">
                <ul className="mobile-menu">
                  <ul className="menu-vertical sf-arrows">
                    {productCategories &&
                      productCategories.map((item, idx) => {
                        return (
                          <>
                            <li key={idx} className={"sf-with-ul"}>
                              <ALink
                                href={
                                  "/shop/sidebar/3cols?category=" +
                                  item.name
                                }
                                scroll={false}
                                onClick={(e) => {
                                  onToggle(e);
                                  e.preventDefault();
                                }}
                              >
                                {item.name}
                              </ALink>

                              {/* <ul className="menu-vertical sf-arrows ">
                                {item.sub_category &&
                                  item.sub_category.map((i, idx) => {
                                    return (
                                      <>
                                        <li
                                          key={idx}
                                          className={
                                            query.sub_category == "furniture"
                                              ? "active"
                                              : ""
                                          }
                                        >
                                          <ALink
                                            href={
                                              "/shop/sidebar/3cols?category=" +
                                              item.category +
                                              "&sub_category=" +
                                              i
                                            }
                                            scroll={false}
                                          >
                                            {i}
                                          </ALink>
                                        </li>
                                      </>
                                    );
                                  })}
                              </ul> */}
                            </li>
                          </>
                        );
                      })}
                  </ul>
                </ul>
              </nav>
            </TabPanel>
          </div>
        </Tabs>

        <div className="social-icons">
          <a
            href="https://www.facebook.com/mygrvfurniture"
            className="social-icon social-facebook"
            rel="noopener noreferrer"
            title="Facebook"
            target="_blank"
          >
            <img width="16px" src="images/facebook.png" />
          </a>

          <a
            href="https://www.instagram.com/mygrvfurniture/"
            className="social-icon social-instagram"
            rel="noopener noreferrer"
            title="Instagram"
            target="_blank"
          >
            <img width="16px" src="images/instagram.png" />
          </a>
          <a
            href="https://www.tiktok.com/@grvfurniture?lang=en"
            className="social-icon"
            rel="noopener noreferrer"
            title="TikTok"
            target="_blank"
          >
            <img width="16px" src="images/tiktok.png" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default React.memo(MobileMenu);
