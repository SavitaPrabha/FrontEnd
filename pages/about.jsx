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
          style={{ backgroundImage: `url(https://as1.ftcdn.net/v2/jpg/04/28/77/22/1000_F_428772239_20fuXf2zil4e9mnvbWhO9EtHTlrK3Ojv.jpg)` }}
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
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum, autem placeat. Rerum porro aliquid officiis modi at consequuntur quae autem fugiat veritatis fuga ipsa repellat quod minus quos obcaecati tempora, molestiae, sunt consequatur harum, velit provident cum tenetur deleniti eum!
                </p>
                <p className="mb-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam repellendus sunt distinctio amet quas quam nam libero soluta vel, alias modi error, quia dolorem nisi aspernatur cumque! Qui, fugiat ullam.
                </p>
              </div>

              <div className="col-lg-6 offset-lg-1">
                <div className="about-images">
                  <img
                    src="https://as2.ftcdn.net/v2/jpg/03/43/76/65/1000_F_343766534_YUj6yuLc3gdRqeYxKg0FSPcedsDkcKm0.jpg"
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
