import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InputRange from "react-input-range";
import SlideToggle from "react-slide-toggle";
import "react-input-range/lib/css/index.css";
import { postSubmitForm } from "~/helpers/forms_helper";

import ALink from "~/components/features/alink";
import { shopData } from "~/utils/data";

function ShopSidebarOne(props) {
  const { toggle = false } = props;
  const router = useRouter();
  const query = useRouter().query;
  const [priceRange, setRange] = useState({ min: 0, max: 1000 });
  const [sidebarData, setSidebarData] = useState();
  const [allCategories, setAllCategories] = useState();
  const [subCategories, setSubCategories] = useState();
  const [trottle, settrottle] = useState(true);
  const loadSidebarData = async (variables) => {
    try {
      let url = process.env.NEXT_PUBLIC_SERVER_URL + "/products/sidebar_data";
      const response = await postSubmitForm(url, variables);
      console.log(variables, "variables", variables);

      if (response && response.data) {
        console.log(response);
        setSidebarData(response.data);
        setAllCategories(response.data.categories);
        let selectedCategory = response.data.categories.find((ele) => {
          if (String(ele.category).trim() == String(query.category).trim())
            return;
        });
        console.log(selectedCategory);
        if (selectedCategory && selectedCategory.sub_category)
          setSubCategories(selectedCategory.sub_category);
        setRange({
          min: parseInt(response.data.minPrice),
          max: parseInt(response.data.maxPrice),
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    loadSidebarData({
      sub_category: query.sub_category || null,

      category: query.category || null,
    });
  }, [query]);

  useEffect(() => {
    if (query.minPrice && query.maxPrice) {
      setRange({
        min: parseInt(query.minPrice),
        max: parseInt(query.maxPrice),
      });
    }
    let selectedCategory =
      allCategories && allCategories
        ? allCategories.find((ele) => ele.category === query.category)
        : "";
    if (selectedCategory) setSubCategories(selectedCategory.sub_category);
    console.log("aa3", query, selectedCategory);
  }, [query]);

  function onChangePriceRange(value) {
    setRange((oldState) => {
      return value;
    });
    console.log(value);
    const { min, max } = value;

    if (trottle) {
      settrottle(false);
      setTimeout(() => {
        settrottle(true);
        router.push({
          pathname: router.pathname,
          query: {
            ...query,
            minPrice: min,
            maxPrice: max,
            page: query.page || 1,
          },
        });
      }, 3000);
    }
  }

  function containsAttrInUrl(type, value) {
    const currentQueries = query[type] ? query[type].split(",") : [];
    return currentQueries && currentQueries.includes(value);
  }

  function getUrlForAttrs(type, value) {
    let currentQueries = query[type] ? query[type].split(",") : [];
    currentQueries = containsAttrInUrl(type, value)
      ? currentQueries.filter((item) => item !== value)
      : [...currentQueries, value];

    return {
      pathname: router.pathname,
      query: {
        ...query,
        page: query.page || 1,
        [type]: currentQueries.join(","),
      },
    };
  }

  function onAttrClick(e, attr, value) {
    console.log(value, attr);
    if (query.category) {
      // set subcategories
      let selectedCategory = allCategories.find((ele) => {
        ele.category == query.category;
      });
      console.log(selectedCategory);
      if (selectedCategory && selectedCategory.sub_category)
        setSubCategories(selectedCategory.sub_category);
    }
    if (getUrlForAttrs(attr, value)) {
      let queryObject = getUrlForAttrs(attr, value).query;
      console.log(queryObject);
      let url = router.pathname.replace("[type]", query.type) + "?";
      for (let key in queryObject) {
        if (key !== "type") {
          url += key + "=" + queryObject[key] + "&";
        }
      }
      router.push(url);
    }
  }

  return (
    <>
      <aside
        className={`${toggle ? "sidebar-filter" : "sidebar"} sidebar-shop`}
      >
        <div className={toggle ? "sidebar-filter-wrapper" : ""}>
          <div className="widget widget-clean">
            <label>Filters:</label>
            <ALink
              href={{ pathname: router.pathname, query: { type: query.type } }}
              className="sidebar-filter-clear"
              scroll={false}
            >
              Clear All
            </ALink>
          </div>

          <SlideToggle collapsed={false}>
            {({ onToggle, setCollapsibleElement, toggleState }) => (
              <div className="widget widget-collapsible">
                <h3 className="widget-title mb-2">
                  <a
                    href="#category"
                    className={`${
                      toggleState.toLowerCase() == "collapsed"
                        ? "collapsed"
                        : ""
                    }`}
                    onClick={(e) => {
                      onToggle(e);
                      e.preventDefault();
                    }}
                  >
                    Category
                  </a>
                </h3>

                <div ref={setCollapsibleElement}>
                  <div className="widget-body pt-0">
                    <div className="filter-items filter-items-count">
                      {sidebarData &&
                        sidebarData.categories.map((item, index) => (
                          <div className="filter-item" key={`cat_${index}`}>
                            <ALink
                              className={`${
                                query.category == item.category ? "active" : ""
                              }`}
                              href={{
                                pathname: router.pathname,
                                query: {
                                  type: query.type,
                                  category: item.category,
                                },
                              }}
                              scroll={false}
                            >
                              {item.category}
                            </ALink>
                            <span className="item-count">{item.count}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SlideToggle>

          <SlideToggle collapsed={false}>
            {({ onToggle, setCollapsibleElement, toggleState }) => (
              <div className="widget widget-collapsible">
                <h3 className="widget-title mb-2">
                  <a
                    href="#sub_category"
                    className={`${
                      toggleState.toLowerCase() == "collapsed"
                        ? "collapsed"
                        : ""
                    }`}
                    onClick={(e) => {
                      onToggle(e);
                      e.preventDefault();
                    }}
                  >
                    Sub Category
                  </a>
                </h3>

                <div ref={setCollapsibleElement}>
                  <div className="widget-body pt-0">
                    <div className="filter-items filter-items-count">
                      {subCategories &&
                        subCategories.length &&
                        subCategories.map((item, index) => (
                          <div className="filter-item" key={`sub_cat_${index}`}>
                            <ALink
                              className={`${
                                query.sub_category == item ? "active" : ""
                              }`}
                              href={{
                                pathname: router.pathname,
                                query: {
                                  type: query.type,
                                  category: query.category,
                                  sub_category: item,
                                },
                              }}
                              scroll={false}
                            >
                              {item}
                            </ALink>
                            {/* <span className="item-count">{item.count}</span> */}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SlideToggle>

          <SlideToggle collapsed={false}>
            {({ onToggle, setCollapsibleElement, toggleState }) => (
              <div className="widget widget-collapsible">
                <h3 className="widget-title mb-2">
                  <a
                    href="#Size"
                    className={`${
                      toggleState.toLowerCase() == "collapsed"
                        ? "collapsed"
                        : ""
                    }`}
                    onClick={(e) => {
                      onToggle(e);
                      e.preventDefault();
                    }}
                  >
                    Size
                  </a>
                </h3>
                <div ref={setCollapsibleElement}>
                  <div className="widget-body pt-0">
                    <div className="filter-items">
                      {sidebarData &&
                        sidebarData.size.map((item, index) => (
                          <div className="filter-item" key={index}>
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`size-${index + 1}`}
                                onChange={(e) => onAttrClick(e, "size", item)}
                                checked={
                                  containsAttrInUrl("size", item) ? true : false
                                }
                              />
                              <label
                                className="custom-control-label"
                                htmlFor={`size-${index + 1}`}
                              >
                                {item}
                              </label>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SlideToggle>

          <SlideToggle collapsed={false}>
            {({ onToggle, setCollapsibleElement, toggleState }) => (
              <div className="widget widget-collapsible">
                <h3 className="widget-title mb-2">
                  <a
                    href="#label"
                    className={`${
                      toggleState.toLowerCase() == "collapsed"
                        ? "collapsed"
                        : ""
                    }`}
                    onClick={(e) => {
                      onToggle(e);
                      e.preventDefault();
                    }}
                  >
                    Type
                  </a>
                </h3>
                <div ref={setCollapsibleElement}>
                  <div className="widget-body pt-0">
                    <div className="filter-items">
                      {sidebarData && (
                        <>
                          <div className="filter-item" key="0">
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`size-$1`}
                                onChange={(e) => onAttrClick(e, "new", "true")}
                                checked={
                                  containsAttrInUrl("new", "true")
                                    ? true
                                    : false
                                }
                              />
                              <label
                                className="custom-control-label"
                                htmlFor={`size-$1`}
                              >
                                New
                              </label>
                            </div>
                          </div>
                          <div className="filter-item" key="1">
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`size-$2`}
                                onChange={(e) => onAttrClick(e, "top", "true")}
                                checked={
                                  containsAttrInUrl("top", "true")
                                    ? true
                                    : false
                                }
                              />
                              <label
                                className="custom-control-label"
                                htmlFor={`size-$2`}
                              >
                                Top
                              </label>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {/* <div className="filter-colors">
                      {shopData.colors.map((item, index) => (
                        <ALink
                          href={getUrlForAttrs("color", item.color_name)}
                          className={
                            containsAttrInUrl("color", item.color_name)
                              ? "selected"
                              : ""
                          }
                          style={{ backgroundColor: item.color }}
                          key={index}
                          scroll={false}
                        >
                          <span className="sr-only">Color Name</span>
                        </ALink>
                      ))}
                    </div> */}
                  </div>
                </div>
              </div>
            )}
          </SlideToggle>

          <SlideToggle collapsed={false}>
            {({ onToggle, setCollapsibleElement, toggleState }) => (
              <div className="widget widget-collapsible">
                <h3 className="widget-title mb-2">
                  <a
                    href="#colour"
                    className={`${
                      toggleState.toLowerCase() == "collapsed"
                        ? "collapsed"
                        : ""
                    }`}
                    onClick={(e) => {
                      onToggle(e);
                      e.preventDefault();
                    }}
                  >
                    Color
                  </a>
                </h3>
                <div ref={setCollapsibleElement}>
                  <div className="widget-body pt-0">
                    <div className="filter-items">
                      {sidebarData &&
                        sidebarData.colors.map((item, index) => (
                          <div className="filter-item" key={index}>
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`color-${index + 1}`}
                                onChange={(e) => onAttrClick(e, "color", item)}
                                checked={
                                  containsAttrInUrl("color", item)
                                    ? true
                                    : false
                                }
                              />
                              <label
                                className="custom-control-label"
                                htmlFor={`color-${index + 1}`}
                              >
                                {item}
                              </label>
                            </div>
                          </div>
                        ))}
                    </div>
                    {/* <div className="filter-colors">
                      {shopData.colors.map((item, index) => (
                        <ALink
                          href={getUrlForAttrs("color", item.color_name)}
                          className={
                            containsAttrInUrl("color", item.color_name)
                              ? "selected"
                              : ""
                          }
                          style={{ backgroundColor: item.color }}
                          key={index}
                          scroll={false}
                        >
                          <span className="sr-only">Color Name</span>
                        </ALink>
                      ))}
                    </div> */}
                  </div>
                </div>
              </div>
            )}
          </SlideToggle>

          {/* <SlideToggle collapsed={false}>
            {({ onToggle, setCollapsibleElement, toggleState }) => (
              <div className="widget widget-collapsible">
                <h3 className="widget-title mb-2">
                  <a
                    href="#brand"
                    className={`${
                      toggleState.toLowerCase() == "collapsed"
                        ? "collapsed"
                        : ""
                    }`}
                    onClick={(e) => {
                      onToggle(e);
                      e.preventDefault();
                    }}
                  >
                    Brand
                  </a>
                </h3>
                <div ref={setCollapsibleElement}>
                  <div className="widget-body pt-0">
                    <div className="filter-items">
                      {shopData.brands.map((item, index) => (
                        <div className="filter-item" key={index}>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`brand-${index + 1}`}
                              onChange={(e) =>
                                onAttrClick(e, "brand", item.slug)
                              }
                              checked={
                                containsAttrInUrl("brand", item.slug)
                                  ? true
                                  : false
                              }
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={`brand-${index + 1}`}
                            >
                              {item.brand}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SlideToggle> */}

          {/* <SlideToggle collapsed={false}>
            {({ onToggle, setCollapsibleElement, toggleState }) => (
              <div className="widget widget-collapsible">
                <h3 className="widget-title mb-2">
                  <a
                    href="#price"
                    className={`${
                      toggleState.toLowerCase() == "collapsed"
                        ? "collapsed"
                        : ""
                    }`}
                    onClick={(e) => {
                      onToggle(e);
                      e.preventDefault();
                    }}
                  >
                    Price
                  </a>
                </h3>

                <div ref={setCollapsibleElement}>
                  <div className="widget-body pt-0">
                    <div className="filter-price">
                      <div className="filter-price-text d-flex justify-content-between">
                        <span>
                          Price Range:&nbsp;
                          <span className="filter-price-range">
                            ${priceRange.min} - ${priceRange.max}
                          </span>
                        </span>

                        <ALink
                          href={{
                            pathname: router.pathname,
                            query: {
                              ...query,
                              minPrice: priceRange.min,
                              maxPrice: priceRange.max,
                              page: query.page||1,
                            },
                          }}
                          className="pr-2"
                          scroll={false}
                        >
                          Filter
                        </ALink>
                      </div>

                      <div className="price-slider">
                        <InputRange
                          formatLabel={(value) => `$${value}`}
                          maxValue={sidebarData && sidebarData.maxPrice}
                          minValue={0}
                          step={50}
                          value={{min:query.minPrice||0,max:query.maxPrice||sidebarData && sidebarData.maxPrice}}
                          onChange={onChangePriceRange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SlideToggle> */}
        </div>
      </aside>
    </>
  );
}

export default React.memo(ShopSidebarOne);
