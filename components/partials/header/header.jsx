import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import ALink from "~/components/features/alink";
import LoginModal from "~/components/features/modals/login-modal";
import HeaderSearch from "~/components/partials/header/partials/header-search";
import WishlistMenu from "~/components/partials/header/partials/wishlist-menu";
import CartMenu from "~/components/partials/header/partials/cart-menu";
import CategoryMenu from "~/components/partials/header/partials/category-menu";
import MainMenu from "~/components/partials/header/partials/main-menu";
import StickyHeader from "~/components/features/sticky-header";

function Header() {
  const router = useRouter();
  const [containerClass, setContainerClass] = useState("container");

  function openMobileMenu() {
    document.querySelector("body").classList.add("mmenu-active");
  }

  useEffect(() => {
    setContainerClass(
      router.asPath.includes("fullwidth") ? "container-fluid" : "container"
    );
  }, [router.asPath]);

  return (
    <header className="header header-2 header-intro-clearance">
      <div className="header-top" style={{backgroundColor:"#002e30", color:"white"}}>
        <div className={containerClass}>
          <div className="header-left overflow-hidden mr-3 mr-sm-0">
            <div className="welcome-msg d-flex flex-nowrap">
              <p>Special collection already available.</p>
              {/* <ALink href="#">&nbsp;Read more ...</ALink> */}
            </div>
          </div>

          <div className="header-right">
            <ul className="top-menu">
              <li>
                <ALink href="#"> <i className="icon-user" style={{fontSize: '20px'}} /></ALink>
                <ul>
                  
                    <div className="header-dropdown">
                      <LoginModal />
                    </div>
                  
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="header-middle">
        <div className={containerClass}>
        <div class="header-left">
            <button className="mobile-menu-toggler" onClick={openMobileMenu}>
              <span className="sr-only">Toggle mobile menu</span>
              <i className="icon-bars"></i>
            </button>

            <ALink href="/" className="logo">
              <img
                src="images/logo.png"
                alt="Logo"
              />

               <h6> &nbsp;&nbsp; Glam Garb</h6>
              <p style={{color: 'rgb(171, 69, 10)', textAlign: 'center', fontSize: '15px'}}></p>
            </ALink>
           
          </div>

          <div className="header-center">
            <HeaderSearch />
          </div>

          <div className="header-right">
            <div className="account">
              <ALink href="/shop/dashboard" title="My account">
                <div className="icon">
                  <i className="icon-user"></i>
                </div>
                <p>Account</p>
              </ALink>
            </div>

            <WishlistMenu />
            <CartMenu />
          </div>
        </div>
      </div>

      <StickyHeader>
        <div className="header-bottom sticky-header">
          <div className={containerClass}>
            <div className="header-left">
              <CategoryMenu />
            </div>

            <div className="header-center">
              <MainMenu />
            </div>

            <div className="header-right overflow-hidden">
              <i className="la la-lightbulb-o"></i>
              <p className="text-truncate">
                Deals & Promotions
                <span className="highlight">&nbsp;Up to 30% Off</span>
              </p>
            </div>
          </div>
        </div>
      </StickyHeader>
    </header>
  );
}

export default Header;
