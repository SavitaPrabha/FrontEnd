import ALink from "~/components/features/alink";
import PageHeader from "~/components/features/page-header";
import Card from "~/components/features/accordion/card";
import Accordion from "~/components/features/accordion/accordion";

function FAQ() {
  return (
    <div className="main">
      <PageHeader title="F.A.Q." subTitle="" />

      <nav className="breadcrumb-nav">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <ALink href="/">Home</ALink>
            </li>

            <li className="breadcrumb-item active">FAQ</li>
          </ol>
        </div>
      </nav>

      <div className="page-content">
        <div className="container">
          {/* <h2 className="title text-center mb-3">Shipping Information</h2> */}

          <Accordion adClass="accordion-rounded">
            <Card
              title="1. Do you provide financing?"
              adClass="card-box card-sm bg-light"
            >
              Yes, we do provide financing for up to 5 years.
            </Card>

            <Card
              title="2. Will my furniture be assembled for me?"
              adClass="card-box card-sm bg-light"
            >
              Assembly is provided for certain products. There are certain
              prices for assembly Once you add a product to your cart. You will
              get the charges of assembly.
            </Card>

            <Card
              title="3. What should I do if I forget my password?"
              adClass="card-box card-sm bg-light"
            >
              Go to GRVfurniture.ca log-in page and click Forgot Password? Enter
              your e-mail address and we'll give you a link to reset your
              password.
            </Card>

            <Card
              title="4.	Do you provide a warranty?"
              adClass="card-box card-sm bg-light"
            >
              GRV wants you to be happy with your purchase. You will get a
              1-year warranty. Even though some furniture makers do not provide
              a written or dated guarantee. If you have any issues, please
              contact our customer service department. If the item can't be
              fixed, you'll be given an identical replacement at no additional
              cost. If no substitute is available, a reselection will be given.
              Please keep in mind that certain flaws in natural materials like
              wood or leather are to be anticipated and are not considered
              defects.
            </Card>
            <Card
              title="5.	Do you deliver all over Canada?"
              adClass="card-box card-sm bg-light"
            >
              We presently deliver to all major Canadian cities. Simply input
              your postal code before placing an order to find out if we deliver
              to your area. If it didn’t show up with your postal code. Then
              leave your address and postal code and our customer support
              representative will get back to you with delivery information.
            </Card>

            <Card
              title="6.	Is it possible to cancel my order?"
              adClass="card-box card-sm bg-light"
            >
              If the product is in stock. You can cancel your order within
              48hrs. Any cancellation after 48hrs will be charged 25% restocking
              charges If the item is not in stock then you can cancel the order
              within 7 days. Any cancellation after 7 days will be charged 25%
              cancellation fee. If it’s a special/custom order, there is no
              cancellations.
            </Card>
            <Card
              title="7. How do you handle returns?"
              adClass="card-box card-sm bg-light"
            >
              Every sale is final. If you find hidden damage, you have 48 hours
              to report it. Contact the customer care department of the GRV. If
              the item can't be fixed, you'll be given an identical replacement
              at no additional cost. If no substitute is available, a
              reselection will be given.
            </Card>
            <Card
              title="8.	Is it possible to change my delivery date?"
              adClass="card-box card-sm bg-light"
            >
              Delivery dates are arranged according to the availability of the
              product. If you want delivery on a specific day, please contact
              our Customer Care team to make changes in your delivery.
            </Card>
            <Card
              title="9.	Can we pick the furniture on the same day once we order online?"
              adClass="card-box card-sm bg-light"
            >
              Once you place the order, you will be given a pick up date. The
              pick up day will be the same or any other specific date depending
              on the product that you purchase.
            </Card>
          </Accordion>
        </div>
      </div>

      <div
        className="cta cta-display bg-image pt-4 pb-4"
        style={{ backgroundImage: `url(images/backgrounds/cta/bg-7.jpg)` }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-9 col-xl-7">
              <div
                className={`row no-gutters flex-sm-row align-items-sm-center`}
              >
                <div className="col">
                  <h3 className="cta-title text-white">
                    If You Have More Questions
                  </h3>
                </div>

                <div className="col-auto">
                  <ALink
                    href="/contact"
                    className="btn btn-outline-white"
                  >
                    <span>CONTACT US</span>
                    <i className="icon-long-arrow-right"></i>
                  </ALink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
