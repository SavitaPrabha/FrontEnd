import { LazyLoadImage } from "react-lazy-load-image-component";

import ALink from "~/components/features/alink";
import OwlCarousel from "~/components/features/owl-carousel";

import { homeData, mainSlider5, mainSlider9 } from "~/utils/data";

function About() {
  return (
    <div className="main">
      <nav className="breadcrumb-nav border-0 mb-0">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <ALink href="/">Home</ALink>
            </li>

            <li className="breadcrumb-item active">About us</li>
          </ol>
        </div>
      </nav>

      <div className="container">
        <div
          className="page-header page-header-big text-center"
          style={{ backgroundImage: `url(images/about-header-bg.jpg)` }}
        >
          <h1 className="page-title text-white">
            About us<span className="text-white">Who we are</span>
          </h1>
        </div>
      </div>

      <div className="page-content pb-0">
        <div className="bg-light-2 pt-6 pb-5 mb-6 mb-lg-8">
          <div className="container">
            <div className="row">
              <div className="col-lg-5 mb-3 mb-lg-0">
                <h2 className="title">Who We Are</h2>
                <p className="lead text-primary mb-3">
                  This isn’t just a statement for us at GRV. This is how we make
                  our daily & long-term choices – whether it’s the product
                  quality or customer service you experience.
                </p>
                <p className="mb-2">
                  Buying furniture is a high involvement decision. Understanding
                  your needs is our priority - your style, your space & your
                  preferences. Accordingly, our trusted home experts & 50+
                  vendors offer the best quality furniture at minimum prices
                  customized to your needs.
                </p>
              </div>

              <div className="col-lg-6 offset-lg-1">
                <div className="about-images">
                  <img
                    src="images/about/img-1.jpg"
                    alt=""
                    className="about-img-front"
                  />
                  <img
                    src="images/about/img-2.jpg"
                    alt=""
                    className="about-img-back"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
