import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import ALink from "~/components/features/alink";
import { stateToHTML } from "draft-js-export-html";
import { convertFromRaw } from "draft-js";
import store from "store";
import { toast } from "react-toastify";
import moment from "moment";
import { postSubmitForm } from "~/helpers/forms_helper";

function InfoOne(props) {
  const [user, setUser] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [userrating, setUserRating] = useState();
  const [usercomment, setUserComment] = useState();
  const [reviews, setReviews] = useState();

  const { product } = props;

  useEffect(() => {
    loadReviews();
    setUser(store.get("user") ? store.get("user") : null);

  }, []);

  const convertFromJSONToHTML = (text) => {
    try {
      return { __html: stateToHTML(convertFromRaw(text)) };
    } catch (exp) {
      console.log(exp);
      return { __html: "Error" };
    }
  };

  const setRating = (e) => {
    e.preventDefault();

    setUserRating(e.target.innerText);

    if (e.currentTarget.parentNode.querySelector(".active")) {
      e.currentTarget.parentNode
        .querySelector(".active")
        .classList.remove("active");
    }

    e.currentTarget.classList.add("active");
  };

  const handleReviewInsert = async () => {
    if (!userrating) {
      toast.error("Please select rating.");
      return;
    }
    if (!usercomment) {
      toast.error("Please enter comment.");
      return;
    }
    const data_to_send = {
      product_id: product._id,
        product_name:product.name ,
        customer_id:user._id ,
        customer_name:user.name ,
        rating:userrating,
        comment:usercomment,
    };

    let url = process.env.NEXT_PUBLIC_SERVER_URL + "/reviews/insert";
    const response = await postSubmitForm(url, data_to_send);
    if (response && response.status === 1) {
      toast.success(response.message);

      window.location.reload();
    } else{
      toast.error(response.message);
    }
  };

  if (!product) {
    return <div></div>;
  }
  const loadReviews = async ()=>
  {
    
    let url = process.env.NEXT_PUBLIC_SERVER_URL + "/reviews/get_by_product_id";
    const response = await postSubmitForm(url,{product_id:product._id});
    if (response && response.status === 1) {
      setReviews(response.data);
    } else {
      toast.error(response.message);
    }
  }

  return (
    <Tabs selectedTabClassName="show" selectedTabPanelClassName="active show">
      <div className="product-details-tab">
        <TabList className="nav nav-pills justify-content-center">
          <Tab className="nav-item">
            <span className="nav-link">Descriptions</span>
          </Tab>

          <Tab className="nav-item">
            <span className="nav-link">Reviews</span>
          </Tab>
        </TabList>

        <div className="tab-content">
          <TabPanel className="tab-pane">
            <div>{product.description?product.description:"No Description"}</div>
          </TabPanel>

          <TabPanel className="tab-pane">
            <div className="reviews">
             {
              reviews &&
              <div className="review" >
              <div className="row no-gutters">
                <div className="col-auto" style={{ width: "200px" }}>
                  <h4>
                    <ALink href="#">{reviews && reviews.customer_name}</ALink>
                  </h4>

                  <div className="ratings-container">
                    <div className="ratings">
                      <div
                        className="ratings-val"
                        style={{ width:reviews && reviews.rating * 20 + "%" }}
                      ></div>
                      <span className="tooltip-text">
                        {reviews &&reviews.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <span className="review-date mb-1">
                    {moment(reviews &&reviews.createdAt).calendar()}
                  </span>
                </div>
                <div className="col">
                  <div className="review-content">
                    <p>{reviews &&reviews.comment}</p>
                  </div>
                </div>
              </div>
            </div>
             }
                
              
            </div>

            {user ? (
              <div className="reply">
                <div className="title-wrapper text-left">
                  <h3 className="title title-simple text-left text-normal">
                    Add a Review
                  </h3>
                </div>

                <div className="rating-form">
                  <label htmlFor="rating" className="text-dark">
                    Your rating{" "}
                  </label>
                  <span className="rating-stars selected">
                    {[1, 2, 3, 4, 5].map((num, index) => (
                      <a
                        className={`star-${num}`}
                        href="#"
                        onClick={setRating}
                        key={"star-" + index}
                      >
                        {num}
                      </a>
                    ))}
                  </span>

                  <select
                    name="rating"
                    id="rating"
                    required=""
                    style={{ display: "none" }}
                  >
                    <option value="">Rate…</option>
                    <option value="5">Perfect</option>
                    <option value="4">Good</option>
                    <option value="3">Average</option>
                    <option value="2">Not that bad</option>
                    <option value="1">Very poor</option>
                  </select>
                </div>

                <textarea
                  id="reply-message"
                  cols="30"
                  rows="5"
                  className="form-control mb-2"
                  placeholder="Comment *"
                  value={usercomment}
                  onChange={(e) => setUserComment(e.target.value)}
                  required
                ></textarea>

                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleReviewInsert}
                >
                  Submit
                </button>
              </div>
            ) : (
              <>
                <p>Please sign-in / register to give reviews.</p>{" "}
                <ALink href="/login" className="btn btn-outline-primary-2">
                  <span>Sign In / Register</span>
                  <i className="icon-long-arrow-right"></i>
                </ALink>
              </>
            )}
          </TabPanel>
        </div>
      </div>
    </Tabs>
  );
}

export default React.memo(InfoOne);
