import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Reveal, { Fade } from "react-awesome-reveal";
import Countdown from "react-countdown";

import ALink from "~/components/features/alink";
import OwlCarousel from "~/components/features/owl-carousel";
import SpecialCollection from "~/components/partials/home/special-collection";
import TopCollection from "~/components/partials/home/top-collection";
import BlogCollection from "~/components/partials/home/blog-collection";
// import NewsletterModal from "~/components/features/modals/newsletter-modal";
import { rendererThree } from "~/components/features/count-down";

import withApollo from "~/server/apollo";
import { GET_HOME_DATA } from "~/server/queries";
import { attrFilter } from "~/utils";

import {
  homeData,
  introSlider,
  brandSlider,
  fadeInUpShorter,
  fadeInLeftShorter,
  fadeInRightShorter,
  fadeIn,
} from "~/utils/data";
import { postSubmitForm } from "~/helpers/forms_helper";
import { toast } from "react-toastify";
import { setSubscriberMobile } from "reactstrap";

function Home() {
  // const { data, loading, error } = useQuery(GET_HOME_DATA);
  // const products = data && data.homeData.products;
  // const topProducts = attrFilter(data && data.homeData.products, "top");
  // const posts = data && data.homeData.posts;

  let error = false;

  const [products, setProducts] = useState([]),
    [topProducts, setTopProducts] = useState([]),
    [combos, setCombos] = useState([]),
    [dealsAndPromotions, setDealsAndPromotions] = useState([]),
    [topRated, setRated] = useState([]),
    [loading, setLoading] = useState(true),
    [sidebarImage, setSidebarImage] = useState([]);

  const getHomeProducts = async () => {
    let url = process.env.NEXT_PUBLIC_SERVER_URL + "/products/getall";
    const response = await postSubmitForm(url, null);
    //console.log(response.data,"Ashish")
    setProducts(response.data);
    setCombos(response.data);
    setDealsAndPromotions(response.data);
    setRated(response.data);
    setTopProducts(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getHomeProducts();
    loadSettings();
  }, []);

  const [subscriberEmail, setSubscriberEmail] = useState();
  const [subscriberMobile, setSubscriberMobile] = useState();
  const [subscriberMessage, setSubscriberMessage] = useState();
  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const loadSettings = async () => {
    let url = "https://api-grv.onebigbit.com/" + "settings/getal";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      console.log(response.data[0].slider_images, "gjhgjhgj");
      setSidebarImage(response.data[0].slider_images);
    } else {
      showNotification(response.message, "Error");
    }
  };

  const handleSubscribe = async (e, v) => {
    e.preventDefault();
    if (validateEmail(subscriberEmail)) {
      let url = process.env.NEXT_PUBLIC_SERVER_URL + "/subscribe/insert";
      const response = await postSubmitForm(url, {
        email: subscriberEmail,
        mobile: subscriberMobile,
        name: subscriberMessage,
      });

      if (response && response.status === 1) {
        toast.success("Subscribed successfully");
        window.location.reload();
      } else {
        toast.error(response.messages);
      }
    } else {
      toast.error("Invalid Email.");
    }
  };

  return (
    <div className="main home-page skeleton-body">
      <div className="intro-slider-container">
        <OwlCarousel
          adClass="owl-simple"
          options={introSlider}
        >
          <>
              
              <a
              href={"#"}
            
            >
                <div
                  className="intro-slide slide2"
                >
                 
                    <img
                      src={"images/banners/banner-1.jpg"}
                      className="position-absolute"
                      alt="slide"
                    />
                

                  <div className="container intro-content" style={{marginTop:"100px"}}>
                    <Fade direction="up">
                 <>
                   <h2 className="intro-subtitle">Deals and Promotions</h2>
                   <h1 className="intro-title" style={{color:"#ffffff"}}>
                   Meet your <br />
                   new heaven space <br />
                     <span className="text" style={{color:"#b6afaf"}}>Up to 30 %</span>
                   </h1>
                   <ALink
                     href="/shop/sidebar/3cols"
                     className="btn btn-dark btn-outline-darker" style={{color:"#ffe6e6", border:"1px solid #ffe6e6"}}>
                     <span>Shop Now</span>
                     <i className="icon-long-arrow-right"></i>
                   </ALink>
                 </>
               </Fade>
                  </div>
                </div>
                </a>
              </>
           
        </OwlCarousel>
     
      </div>
      {/* <NewsletterModal /> */}
      {/* <OwlCarousel
        adClass="brands-border owl-simple brand-carousel cols-xl-7 cols-lg-5 cols-md-4 cols-sm-3 cols-2"
        options={brandSlider}
      >
        {homeData.brands.map((brand, index) => {
          return (
            <ALink href="#" className="brand mr-0" key={index}>
              <img
                src={brand.image}
                alt="brand"
                width={brand.width}
                height={brand.height}
              />
            </ALink>
          );
        })}
      </OwlCarousel> */}
      {/* 
      <div className="mb-3 mb-lg-5"></div> */}
      {/* 
      <div className="banner-group">
        <div className="container">
          <div className="row">
            <div className="col-sm-6 col-lg-5">
              <div className="banner banner-large banner-overlay banner-overlay-light banner-lg banner-1 lazy-media">
                <div className="lazy-overlay"></div>

                <LazyLoadImage
                  alt="banner"
                  src="images/home/banners/banner-1.jpg"
                  threshold={200}
                  width="100%"
                  height="auto"
                  effect="blur"
                />

                <div className="banner-content banner-content-top">
                  <Fade direction="left">
                    <>
                      <h4 className="banner-subtitle">New Arrivals</h4>
                      <h3 className="banner-title">Coffee Tables</h3>
                      <div className="banner-text">from $19.99</div>
                      <ALink
                        href="/shop/sidebar/3cols"
                        className="btn btn-outline-gray banner-link"
                      >
                        Discover Now<i className="icon-long-arrow-right"></i>
                      </ALink>
                    </>
                  </Fade>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="banner banner-overlay banner-lg banner-2 lazy-media">
                <div className="lazy-overlay"></div>

                <LazyLoadImage
                  alt="banner"
                  src="images/home/banners/banner-2.jpg"
                  threshold={200}
                  height="auto"
                  width="100%"
                  effect="blur"
                />

                <div className="banner-content banner-content-top">
                  <Fade direction="up">
                    <>
                      <h4 className="banner-subtitle text-grey">
                        Deals & Promotions
                      </h4>
                      <h3 className="banner-title text-white">Kitchenware</h3>
                      <div className="banner-text text-white">from $39.99</div>
                      <ALink
                        href="/shop/sidebar/3cols"
                        className="btn btn-outline-white banner-link"
                      >
                        Discover Now<i className="icon-long-arrow-right"></i>
                      </ALink>
                    </>
                  </Fade>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-12 col-lg-4">
              <div className="row">
                <div className="col-lg-12 col-md-6 col-sm-6">
                  <div className="banner banner-3 banner-overlay lazy-media">
                    <div className="lazy-overlay"></div>

                    <LazyLoadImage
                      alt="banner"
                      src="images/home/banners/banner-3.jpg"
                      threshold={200}
                      height="auto"
                      width="100%"
                      effect="blur"
                    />

                    <div className="banner-content banner-content-top">
                      <Fade direction="down">
                        <>
                          <h4 className="banner-subtitle">New Arrivals</h4>
                          <h3 className="banner-title">Home Decor</h3>
                          <ALink
                            href="/shop/sidebar/3cols"
                            className="btn btn-outline-gray banner-link"
                          >
                            Discover Now
                            <i className="icon-long-arrow-right"></i>
                          </ALink>
                        </>
                      </Fade>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-6 col-sm-6">
                  <div className="banner banner-4 banner-overlay banner-overlay-light lazy-media">
                    <div className="lazy-overlay"></div>

                    <LazyLoadImage
                      alt="banner"
                      src="images/home/banners/banner-4.jpg"
                      threshold={200}
                      width="100%"
                      height="auto"
                      effect="blur"
                    />

                    <div className="banner-content banner-content-top">
                      <Fade direction="down">
                        <>
                          <h4 className="banner-subtitle">
                            Deals & Promotions
                          </h4>
                          <h3 className="banner-title">Collection Chairs</h3>
                          <div className="banner-text">up to 30% off</div>
                          <ALink
                            href="/shop/sidebar/3cols"
                            className="btn btn-outline-gray banner-link"
                          >
                            Discover Now
                            <i className="icon-long-arrow-right"></i>
                          </ALink>
                        </>
                      </Fade>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="mb-3"></div>

      <Reveal keyframes={fadeIn} delay={200} duration={1000} triggerOnce>
        <SpecialCollection
          products={products}
          dealsAndPromotions={dealsAndPromotions}
          rated={topRated}
          loading={loading}
        />
      </Reveal>

      <div className="mb-6"></div>
      <Reveal keyframes={fadeIn} delay={200} duration={1000} triggerOnce>
        <TopCollection
          products={topProducts}
          combos={combos}
          loading={loading}
        />
      </Reveal>
      {/* <BlogCollection posts={posts} loading={loading}></BlogCollection> */}
      <Reveal keyframes={fadeIn} delay={200} duration={1000} triggerOnce>
        <div className="icon-boxes-container">
          <div className="container">
            <div className="row">
              <div className="col-sm-6 col-lg-3">
                <div className="icon-box icon-box-side">
                  <span className="icon-box-icon text-dark">
                    <i className="icon-truck"></i>
                  </span>
                  <div className="icon-box-content">
                    <h3 className="icon-box-title">Free Delivery</h3>

                    <p>Over CAD 999 with GTA</p>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-lg-3">
                <div className="icon-box icon-box-side">
                  <span className="icon-box-icon text-dark">
                    <i className="icon-clock-o"></i>
                  </span>

                  <div className="icon-box-content">
                    <h3 className="icon-box-title">On-Time Delivery</h3>

                    <p>We deliver On-Time</p>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-lg-3">
                <div className="icon-box icon-box-side">
                  <span className="icon-box-icon text-dark">
                    <i className="icon-certificate"></i>
                  </span>

                  <div className="icon-box-content">
                    <h3 className="icon-box-title">Warranty</h3>

                    <p>1 Year manufacturer warranty</p>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-lg-3">
                <div className="icon-box icon-box-side">
                  <span className="icon-box-icon text-dark">
                    <i className="icon-headphones"></i>
                  </span>

                  <div className="icon-box-content">
                    <h3 className="icon-box-title">We Support</h3>

                    <p>Exceptional Customer Service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal keyframes={fadeIn} delay={200} duration={1000} triggerOnce>
        <div
          className="footer-newsletter bg-image"
          style={{ backgroundImage: "url(images/backgrounds/bg-2.jpg)" }}
        >
          <div className="container">
            <div className="heading text-center">
              <h3 className="title">Get The Latest Deals</h3>

              <p className="title-desc">
                and receive&nbsp;
                <span>$20 coupon</span> for first shopping
              </p>
            </div>

            <div className="row">
              <div className="col-sm-12 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                <form action="#">
                  <div className="input-group rounded ">
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => {
                        setSubscriberMessage(e.target.value);
                      }}
                      placeholder="Name"
                      aria-label="Email Adress"
                    />
                  </div>
                  <br />
                  <div className="input-group rounded">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Phone"
                      onChange={(e) => {
                        setSubscriberMobile(e.target.value);
                      }}
                      aria-label="Email Adress"
                    />
                  </div>
                  <br />
                  <div className="input-group borderRadius">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      onChange={(e) => {
                        setSubscriberEmail(e.target.value);
                      }}
                      aria-label="Email Adress"
                      required
                    />
                  </div>
                  <br />
                  <div className=" input-group input-group-append">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      id="newsletter-btn"
                      onClick={handleSubscribe}
                    >
                      <span>Subscribe</span>
                      <i className="icon-long-arrow-right"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
      {/* <NewsletterModal /> */}
    </div>
  );
}

export default Home;
