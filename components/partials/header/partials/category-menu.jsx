import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import ALink from "~/components/features/alink";
import { postSubmitForm } from "~/helpers/forms_helper";

function CategoryMenu() {
  const query = useRouter().query;
  const [productCategories, setProductCategories] = useState([]);

  const loadProductCategories = async () => {
    let url = process.env.NEXT_PUBLIC_SERVER_URL + "/productcategories/getall";
    const response = await postSubmitForm(url, null);

    setProductCategories(response.data);
  };
  //console.log(productCategories, "category");
  useEffect(() => {
    loadProductCategories();
  }, []);

  return (
    <div className="dropdown category-dropdown">
      <ALink
        href="/shop/sidebar/3cols"
        className="dropdown-toggle"
        title="Browse Categories"
      >
        Browse Categories
      </ALink>

      <div className="dropdown-menu">
        <nav className="side-nav">
          <ul className="menu-vertical sf-arrows">
            {productCategories &&
              productCategories.map((item, idx) => {
                return (
                  <>
                    <li key={idx} className={"sf-with-ul"}>
                      <ALink
                        href={"/shop/sidebar/3cols?category=" + item.category}
                        scroll={false}
                      >
                        {item.category}
                      </ALink>

                      <ul className="menu-vertical sf-arrows ">
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
                      </ul>
                    </li>
                  </>
                );
              })}
            {/* <li className={query.category == "furniture" ? "active" : ""}>
              <ALink
                href="/shop/sidebar/3cols?category=Living Room"
                href="/"
                scroll={false}
              >
                Living Room
              </ALink>
            </li> */}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default CategoryMenu;
