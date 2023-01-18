import GoogleMapReact from "google-map-react";
import { useState } from "react";
import ALink from "~/components/features/alink";
import { postSubmitForm } from "~/helpers/forms_helper";
import { toast } from "react-toastify";

const marker_image_style = { width: "30px", "margin-left": "35px" };
const marker_text_style = {
  "font-weight": "bold",
};
const marker_div_style = {
  "text-align": "center",
  width: "100px",
};

const MapComponent = ({ text }) => (
  <div style={marker_div_style}>
    <img src="images/map_marker.png" alt="desc" style={marker_image_style} />

    <span style={marker_text_style}>{text}</span>
  </div>
);

function Contact() {
  const [loading, setLoading] = useState(false);
  const [dataToSend, setDataToSend] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    //console.log(name, value);
    setDataToSend((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    let url = process.env.NEXT_PUBLIC_SERVER_URL + "/contact";
    const response = await postSubmitForm(url, {
      name: dataToSend.name,
      email: dataToSend.email,
      mobile: dataToSend.mobile,
      subject: dataToSend.subject,
      message: dataToSend.message,
    });
    if (response && response.status === 1) {
      toast.success(response.message);
      setDataToSend({
        name: "",
        email: "",
        mobile: "",
        subject: "",
        message: "",
      });
      setLoading(false);
    } else {
      toast.error(response.message);
      setLoading(false);
    }
  };
  return (
    <div className="main">
      <nav className="breadcrumb-nav border-0 mb-0">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <ALink href="/">Home</ALink>
            </li>

            <li className="breadcrumb-item active">Contact us</li>
          </ol>
        </div>
      </nav>

      <div className="container">
        <div
          className="page-header page-header-big text-center"
          style={{ backgroundImage: `url(images/contact-header-bg.jpg)` }}
        >
          <h1 className="page-title text-white">
            Contact us<span className="text-white">keep in touch with us</span>
          </h1>
        </div>
      </div>

      <div className="page-content pb-0">
        <div className="container">
          <div className="row">
            <div className="stores col-lg-6 mb-4 mb-lg-5">
              <h2 className="title text-center mb-3">Our Locations</h2>

              <div className="row">
                <div className="col-lg-12">
                  <div className="store">
                    <div className="row align-items-center">
                      <div className="col-sm-6 col-xl-6">
                        <div className="store-content">
                          <h3 className="store-title">
                          Unit-3, 1181 Kennedy Road, Scarborough, ON, M1P 2L2
                          </h3>
                          <div>
                            Contact :{" "}
                            <a href="tel:647344 5455">647-344-5455</a>
                          </div>
                          <div>
                            Email :{" "}
                            <a href="mailto:info@grvfurniture.ca">
                            info@grvfurniture.ca
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-xl-6">
                        <div className="store-content">
                          <h4 className="store-subtitle">Timings:</h4>
                          <div>Monday to Friday 11 AM to 8.30 PM</div>
                          <div>Saturday & Sunday 11 AM to 7 PM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="col-lg-12">
                  <div className="store">
                    <div className="row align-items-center">
                      <div className="col-sm-6 col-xl-6">
                        <div className="store-content">
                          <h3 className="store-title">
                          Unit-1, 1125 Kennedy Road, Scarborough, ON, M1P 2L2
                          </h3>
                          <div>
                            Contact :{" "}
                            <a href="tel:416-901-7008">416-901-7008</a>
                          </div>
                          <div>
                            Email :{" "}
                            <a href="mailto:myamfurniture@gmail.com">
                            myamfurniture@gmail.com
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-xl-6">
                        <div className="store-content">
                          <h4 className="store-subtitle">Timings:</h4>
                          <div>Monday to Friday 11 AM to 8.30 PM</div>
                          <div>Saturday & Sunday 11 AM to 7 PM</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{border: '1px solid red', textAlign: 'center', width: '141px', padding: '5px 5px 5px 5px', color: '#a6c76c', fontSize: '16px', fontWeight: 400}}><svg aria-hidden="true" focusable="false" role="presentation" className="icon icon-pin" viewBox="0 0 32 32" style={{width: '20px', height: 'auto'}}><path d="M4 12a12 12 0 0 1 24 0c0 8-12 20-12 20S4 20 4 12m7 0a5 5 0 0 0 10 0 5 5 0 0 0-10 0z" /></svg>&nbsp;<a href="https://www.google.com/maps?daddr=1181+Kennedy+Road,Unit-3" target="_blank">Get directions</a></div>
                </div>










                
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className="title mb-1">Got Any Questions?</h2>
              <p className="mb-2">
                Use the form below to get in touch with the sales team
              </p>

              <form
                action="#"
                onSubmit={handleSubmit}
                className="contact-form mb-3"
              >
                <div className="row">
                  <div className="col-sm-6">
                    <label htmlFor="cname" className="sr-only">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cname"
                      name="name"
                      placeholder="Name *"
                      onChange={handleChange}
                      value={dataToSend.name}
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <label htmlFor="cemail" className="sr-only">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="cemail"
                      name="email"
                      placeholder="Email *"
                      onChange={handleChange}
                      value={dataToSend.email}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <label htmlFor="cphone" className="sr-only">
                      Mobile
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="cphone"
                      name="mobile"
                      placeholder="Mobile"
                      onChange={handleChange}
                      value={dataToSend.mobile}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label htmlFor="csubject" className="sr-only">
                      Subject
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="csubject"
                      name="subject"
                      placeholder="Subject"
                      onChange={handleChange}
                      value={dataToSend.subject}
                    />
                  </div>
                </div>

                <label htmlFor="cmessage" className="sr-only">
                  Message
                </label>
                <textarea
                  className="form-control"
                  cols="30"
                  rows="4"
                  id="cmessage"
                  name="message"
                  required
                  placeholder="Message *"
                  onChange={handleChange}
                  value={dataToSend.message}
                ></textarea>

                <button
                  type="submit"
                  className="btn btn-outline-primary-2 btn-minwidth-sm"
                  disabled={loading}
                >
                  <span>SUBMIT</span>
                  {!loading && <i className="icon-long-arrow-right"></i>}
                  {loading && (
                    <i className="icon-refresh load-more-rotating"></i>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div id="map" className="w-100">
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyD-k9s5Swvos3u9Ovo2YXJjAwM7fBw3yjY",
            }}
            yesIWantToUseGoogleMapApiInternals
            defaultCenter={{ lat: 43.75, lng: -79.27 }}
            defaultZoom={15}
          >
            <MapComponent
              lat={43.75394731747471}
              lng={-79.2755968269417}
              text="GRV"
            />
            <MapComponent
              lat={43.75142719123291}
              lng={-79.27453760195084}
              text="New Alla Moda"
            />
          </GoogleMapReact>
        </div>
      </div>
    </div>
  );
}

export default Contact;
