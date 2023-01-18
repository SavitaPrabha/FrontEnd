import React, { useState, useEffect } from "react";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import store from "store";
import { postSubmitForm } from "~/helpers/forms_helper";
import { toast } from "react-toastify";
import ALink from "~/components/features/alink";
import PageHeader from "~/components/features/page-header";

import Select from "react-select";
import {
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Button,
  CardTitle,
  CardSubtitle,
  Container,
  Label,
} from "reactstrap";
//import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";
import { AvForm, AvField } from "availity-reactstrap-validation";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import moment from "moment";

function DashBoard() {
  const [user, setUser] = useState(null);
  const [addressModal, setAddressModal] = useState();
  const [orders, setOrders] = useState([]);

  const [helpModal, sethelpModal] = useState();

  useEffect(() => {
    setUser(store.get("user") ? store.get("user") : null);
    getOrders();
    getComplaint();
  }, []);
  const options = [
    { value: "Alberta", label: "Alberta" },
    { value: "British Columbia", label: "British Columbia" },
    { value: "New Brunswick", label: "New Brunswick" },
    { value: "Nova Scotia", label: "Nova Scotia" },
    { value: "Newfoundland and Labrador", label: "Newfoundland and Labrador" },
    { value: "Ontario", label: "Ontario" },
    { value: "Prince Edward Island", label: "Prince Edward Island" },
    { value: "Quebec", label: "Quebec" },
    { value: "Saskatchewan", label: "Saskatchewan" },
    { value: "Yukon", label: "Yukon" },
  ];
  const [customerId, setCustomerId] = useState();
  const [productsDetails, setproductsDetails] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const getOrders = async (e, v) => {
    let url = process.env.NEXT_PUBLIC_SERVER_URL + "/orders/for_customer_web";
    const response = await postSubmitForm(url, null);
    if (response && response.status === 1) {
      console.log(response);
      setOrders(response.data);
      if (response.data && response.data.length) {
        setCustomerId(response.data[0]?.customer_details || "");
        let data = [];
        if (response.data && response.data.product_details)
          data.push(response.data && response.data.product_details);
        setproductsDetails(data);
      }
    }
  };
  console.log(productsDetails, "Ashish");
  const [complaint, setComplaint] = useState();
  const getComplaint = async (e, v) => {
    let url =
      process.env.NEXT_PUBLIC_SERVER_URL + "/complaint/get_by_customer_id";
    const response =
      customerId && customerId._id
        ? await postSubmitForm(url, { id: customerId._id })
        : { status: 0 };
    if (response && response.status === 1) {
      console.log(response);
      setComplaint(response.data);
    }
  };
  // const [coupon, setCoupon] = useState();
  // const loadCoupons = async (e, v) => {
  //   let url =  "https://api-grv.onebigbit.com/coupons/global_coupons";
  //   const response = await postSubmitForm(url,"" )
  //   if (response && response.status === 1) {
  //     console.log(response,"coupons");
  //     setCoupon(response.data);
  //   }
  // }
  // const [specificCoupon, setSpecificCoupon] = useState();
  // const loadSpecificCoupon = async (e, v) => {
  //   let url =  "https://api-grv.onebigbit.com/coupons/customer_specific_coupons";
  //   const response = await postSubmitForm(url,"" )
  //   if (response && response.status === 1) {
  //     console.log(response,"Specific coupons");
  //     setSpecificCoupon(response.data);
  //   }
  // }

  const handleValidSubmit = async (e, v) => {
    let data_to_send = {
      message: v.message,
      product_id: selectedProduct._id,
      customer_id: customerId._id,
    };
    console.log(data_to_send);
    let url = process.env.NEXT_PUBLIC_SERVER_URL + "/complaint/insert";

    const response = await postSubmitForm(url, data_to_send);
    if (response && response.status === 1) {
      toast.success("Complaint is sent successfully.");
      // window.location.reload();
      toComplaints();
    } else {
      toast.error(response.message);
    }
    sethelpModal(!helpModal);
  };

  const handleOrderCancel = async (id) => {
    let url =
      process.env.NEXT_PUBLIC_SERVER_URL + "/orders/update_status_online";

    let data_to_send = {
      id: id,
      status: "Cancelled",
    };
    console.log(data_to_send);
    const response = await postSubmitForm(url, data_to_send);
    if (response && response.status === 1) {
      toast.success("Order Cancelled successfully.");
      getOrders();
    } else {
      toast.error(response.message);
    }
  };
  const rowStyle = { backgroundColor: "#c8e6c9", fontSize: "15px" };
  const columns = [
    {
      dataField: "_id",
      text: "_id",
      hidden: true,
    },
    {
      dataField: "_id",
      formatter: (cell, row, rowIndex) => {
        return rowIndex + 1;
      },
      text: "#",
      headerStyle: (colum, colIndex) => {
        return { width: "3%" };
      },
    },
    {
      dataField: "order_number",
      text: "Order",
    },

    // {
    //   dataField: "subtotal_amount",
    //   formatter: (cell, row) => "$ " + row.subtotal_amount,

    //   text: "Subtotal",
    // },
    {
      dataField: "shipping_charges",
      formatter: (cell, row) => "$ " + row.shipping_charges,
      text: "Shipping",
    },
    {
      dataField: "total_amount",
      formatter: (cell, row) => "$ " + row.total_amount,
      text: "Total",
    },

    {
      dataField: "status",
      text: "Status",
    },
    {
      dataField: "createdAt",
      formatter: (cell, row) =>
        moment(row.createdAt).format("YYYY-MM-DD HH:mm"),

      text: "Date",
    },
    {
      text: "Action",
      formatter: (cell, row) => {
        if (row.status === "Delivered") {
          return "Delivered";
        } else if (row.status === "Cancelled") {
          return "Cancelled";
        } else {
          return (
            <button
              className="text-danger"
              title="Cancel"
              onClick={() => {
                handleOrderCancel(row._id);
              }}
            >
              Cancel
            </button>
          );
        }
      },
    },
  ];

  const columns_product_details = [
    {
      dataField: "_id",
      text: "_id",
      hidden: true,
    },
    {
      dataField: "_id",
      formatter: (cell, row, rowIndex) => {
        return rowIndex + 1;
      },
      text: "#",
      headerStyle: (colum, colIndex) => {
        return { width: "3%" };
      },
    },
    {
      dataField: "name",
      text: "Product Name",
    },
    //   {
    //     // dataField: "model_name",
    //     formatter: (cell, row) => {
    //       let color = ""
    //  row && row.product_details && row.product_details.map((item) => {
    //   color = item.va
    //       })
    //       return color;
    //     },

    //     text: "Color",
    //   },
    {
      dataField: "price",

      text: "Price",
    },
    {
      dataField: "assembly_charges",

      text: "Assembly Charges",
    },

    {
      formatter: (cell, row) => {
        return (
          <button
            className="text-primary"
            title="Help"
            onClick={() => {
              setSelectedProduct(row);
              sethelpModal(!helpModal);
            }}
          >
            Help
          </button>
        );
      },
      text: "Action",
    },
  ];
  //pagination customization
  const pageOptions = {
    sizePerPage: 5,
    prePageText: "Prev",
    nextPageText: "Next",
    totalSize: orders && orders.length, // replace later with size(orders),
    custom: true,
  };
  const { SearchBar } = Search;

  const handleLogout = async (e, v) => {
    let url = process.env.NEXT_PUBLIC_SERVER_URL + "/customers/logout";
    const response = await postSubmitForm(url, null);
    if (response && response.status === 1) {
      store.clearAll();
      window.location.reload();
    } else {
      toast.error(response.message);
    }
  };

  function toOrder(e) {
    e.preventDefault();
    document
      .querySelector(
        ".nav-dashboard .react-tabs__tab-list .nav-item:nth-child(2)"
      )
      .click();
  }

  function toAddress(e) {
    e.preventDefault();
    document
      .querySelector(
        ".nav-dashboard .react-tabs__tab-list .nav-item:nth-child(3)"
      )
      .click();
  }

  function toAccount(e) {
    e.preventDefault();
    document
      .querySelector(
        ".nav-dashboard .react-tabs__tab-list .nav-item:nth-child(4)"
      )
      .click();
  }
  function toComplaints() {
    // e.preventDefault();
    document
      .querySelector(
        ".nav-dashboard .react-tabs__tab-list .nav-item:nth-child(5)"
      )
      .click();
  }

  const handleDefaultAddress = async (e, v) => {
    let url =
      process.env.NEXT_PUBLIC_SERVER_URL + "/customers/set_default_address";
    const response = await postSubmitForm(url, { address_id: e.target.value });
    if (response && response.status === 1) {
      toast.success(response.message);
      const u = store.get("user");
      u.addresses = response.data.addresses;
      store.set("user", u);
      setUser(u);
    } else {
      toast.error(response.message);
    }
  };

  const handleDeleteAddress = async (e, v) => {
    //console.log(e.target.value);
    let url =
      process.env.NEXT_PUBLIC_SERVER_URL + "/customers/delete_address_web";
    const response = await postSubmitForm(url, { address_id: e.target.value });
    if (response && response.status === 1) {
      toast.success(response.message);
      const u = store.get("user");
      u.addresses = response.data.addresses;
      store.set("user", u);
      setUser(u);
    } else {
      toast.error(response.message);
    }
  };

  const handleValidAddress = async (e, v) => {
    console.log(v);
    if (v.province == "") {
      toast.error("Province is required");
    } else {
      const data_to_send = {
        mobile: user.mobile,
        address: {
          _id: uuidv4(),
          apartment_house_number: v.apartment_house_number,
          street_address: v.street_address,
          city: v.city,
          province: v.province,
          pincode: v.pincode,
        },
      };
      console.log(data_to_send);
      let url =
        process.env.NEXT_PUBLIC_SERVER_URL + "/customers/add_address_web";
      const response = await postSubmitForm(url, data_to_send);
      if (response && response.status === 1) {
        toast.success(response.message);
        const u = store.get("user");
        u.addresses = response.data.addresses;
        store.set("user", u);
        setUser(u);
        setAddressModal(!addressModal);
      } else {
        toast.error(response.message);
      }
    }

    //
  };

  const handleUpdateDetails = async (e, v) => {
    e.preventDefault();

    let url =
      process.env.NEXT_PUBLIC_SERVER_URL + "/customers/update_details_web";
    const response = await postSubmitForm(url, {
      name: user.name,
      email: user.email,
    });
    if (response && response.status === 1) {
      toast.success(response.message);
      const u = store.get("user");
      u.name = response.data.name;
      u.email = response.data.email;
      store.set("user", u);
      setUser(u);
    } else {
      toast.error(response.message);
    }
  };

  const rowStyle2 = { fontSize: "14px" };

  const expandRow = {
    onlyOneExpanding: true,

    renderer: (row) => (
      <>
        <strong>Product Details:</strong>
        <BootstrapTable
          keyField="_id"
          columns={columns_product_details}
          data={row.product_details}
          noDataIndication="No orders to display."
          striped
          hover
          rowStyle={rowStyle2}
          search
        />
      </>
    ),
  };

  return (
    <div className="main">
      <PageHeader title="My Account" subTitle="Shop" />
      <nav className="breadcrumb-nav mb-3">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <ALink href="/">Home</ALink>
            </li>
            <li className="breadcrumb-item">
              <ALink href="/shop/sidebar/3cols">Shop</ALink>
            </li>
            <li className="breadcrumb-item active">My Account</li>
          </ol>
        </div>
      </nav>

      <div className="page-content">
        <div className="dashboard">
          <div className="container">
            <ul
              className="nav nav-dashboard flex-column mb-3 mb-md-0"
              role="tablist"
            >
              <Tabs selectedTabClassName="active show">
                <div className="row">
                  <aside className="col-md-4 col-lg-3 mb-md-0 mb-2">
                    <TabList>
                      <Tab className="nav-item">
                        <span className="nav-link">Dashboard</span>
                      </Tab>

                      <Tab
                        className="nav-item"
                        onClick={() => {
                          getOrders();
                        }}
                      >
                        <span className="nav-link">Orders</span>
                      </Tab>

                      <Tab className="nav-item">
                        <span className="nav-link">Addresses</span>
                      </Tab>

                      <Tab className="nav-item">
                        <span className="nav-link">Account Details</span>
                      </Tab>
                      {/* <Tab className="nav-item" 
                      onClick={() => {
                        loadCoupons();
                        loadSpecificCoupon();
                      }}
                      >
                        <span className="nav-link">Coupons</span>
                      </Tab> */}
                      <Tab
                        className="nav-item"
                        onClick={() => {
                          getOrders();
                          getComplaint();
                        }}
                      >
                        <span className="nav-link">My Complaint</span>
                      </Tab>
                      {user && (
                        <div className="nav-item">
                          <span className="nav-link" onClick={handleLogout}>
                            Sign Out
                          </span>
                        </div>
                      )}
                    </TabList>
                  </aside>

                  <div
                    className="col-md-8 col-lg-9"
                    style={{ marginTop: "1rem" }}
                  >
                    <div className="tab-pane">
                      <TabPanel>
                        <p>
                          Hello{" "}
                          <span className="font-weight-normal text-dark">
                            {user ? user.name : "Guest"},
                          </span>{" "}
                          <br />
                          From your account dashboard you can view your{" "}
                          <a
                            href="#tab-orders"
                            onClick={toOrder}
                            className="tab-trigger-link link-underline"
                          >
                            recent orders
                          </a>
                          , manage your{" "}
                          <a
                            href="#tab-address"
                            onClick={toAddress}
                            className="tab-trigger-link"
                          >
                            shipping addresses
                          </a>
                          {"  "} and{" "}
                          <a
                            href="#tab-account"
                            onClick={toAccount}
                            className="tab-trigger-link"
                          >
                            account details
                          </a>
                          .
                        </p>
                      </TabPanel>

                      <TabPanel>
                        {!user && (
                          <>
                            <p>Please sign-in / register to manage orders.</p>{" "}
                            <ALink
                              href="/login"
                              className="btn btn-outline-primary-2"
                            >
                              <span>Sign In / Register</span>
                              <i className="icon-long-arrow-right"></i>
                            </ALink>
                          </>
                        )}
                        {user && (
                          <>
                            <div className="row">
                              <div className="col-lg-12">
                                <p>Manage your orders from here.</p>

                                <Row>
                                  {orders && (
                                    <>
                                      <Col lg={12} md={12}>
                                        <br />
                                        <p className="text-muted mb-2">
                                          <b>Orders </b>
                                        </p>
                                      </Col>
                                      <Col lg={12}>
                                        <BootstrapTable
                                          bootstrap4
                                          keyField="_id"
                                          key="_id"
                                          data={orders}
                                          columns={columns}
                                          expandRow={expandRow}
                                          noDataIndication="No data to display."
                                          rowStyle={rowStyle}
                                        />
                                      </Col>
                                    </>
                                  )}
                                </Row>
                              </div>
                            </div>
                          </>
                        )}
                      </TabPanel>

                      <TabPanel>
                        {!user && (
                          <>
                            <p>
                              Please sign-in / register to manage addresses.
                            </p>{" "}
                            <ALink
                              href="/login"
                              className="btn btn-outline-primary-2"
                            >
                              <span>Sign In / Register</span>
                              <i className="icon-long-arrow-right"></i>
                            </ALink>
                          </>
                        )}
                        {user && (
                          <>
                            <p>Manage your addresses from here.</p>
                            <button
                              className="btn btn-link"
                              onClick={() => {
                                setAddressModal(!addressModal);
                              }}
                            >
                              <i className="icon-plus"></i>
                              <span>Address</span>
                            </button>
                            <div className="row">
                              {user.addresses &&
                                user.addresses.map((address, index) => {
                                  return (
                                    <div className="col-lg-6">
                                      <div className="card card-dashboard">
                                        <div className="card-body">
                                          <h3 className="card-title">
                                            Address #{index + 1}
                                          </h3>
                                          <p>
                                            Set as default shipping address{" "}
                                            <input
                                              type="radio"
                                              name="set_default_address"
                                              onChange={handleDefaultAddress}
                                              checked={address.default_address}
                                              value={address._id}
                                            />
                                          </p>

                                          <p>
                                            <strong>
                                              {" "}
                                              Apartment / House No.:
                                            </strong>{" "}
                                            {address.apartment_house_number}
                                            <br />
                                            <strong>
                                              Street Address:
                                            </strong>{" "}
                                            {address.street_address}
                                            <br />
                                            <strong>City: </strong>
                                            {address.city}
                                            <br />
                                            <strong> Province:</strong>{" "}
                                            {address.province}
                                            <br />
                                            <strong>Pincode: </strong>
                                            {address.pincode}
                                            <br />
                                            <br />
                                            <Button
                                              value={address._id}
                                              onClick={handleDeleteAddress}
                                              className="btn btn-outline-primary btn-round"
                                            >
                                              Delete
                                            </Button>
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </>
                        )}
                      </TabPanel>

                      <TabPanel>
                        {!user && (
                          <>
                            <p>
                              Please sign-in / register to manage account
                              details.
                            </p>{" "}
                            <ALink
                              href="/login"
                              className="btn btn-outline-primary-2"
                            >
                              <span>Sign In / Register</span>
                              <i className="icon-long-arrow-right"></i>
                            </ALink>
                          </>
                        )}

                        {user && (
                          <form action="#">
                            <div className="row">
                              <div className="col-sm-6">
                                <label>Mobile</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  disabled="true"
                                  value={user.mobile}
                                  required
                                />
                              </div>

                              <div className="col-sm-6">
                                <label>Name *</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={user.name}
                                  onChange={(e) => {
                                    console.log(e.target.value);
                                    setUser({ ...user, name: e.target.value });
                                  }}
                                  required
                                />
                              </div>
                            </div>

                            <label>Email address *</label>
                            <input
                              type="email"
                              className="form-control"
                              value={user.email}
                              onChange={(e) => {
                                console.log(e.target.value);
                                setUser({ ...user, email: e.target.value });
                              }}
                              required
                            />

                            <button
                              type="submit"
                              className="btn btn-outline-primary-2"
                              onClick={handleUpdateDetails}
                            >
                              <span>SAVE CHANGES</span>
                              <i className="icon-long-arrow-right"></i>
                            </button>
                          </form>
                        )}
                      </TabPanel>

                      {/* <TabPanel>
                        {!user && (
                          <>
                            <p>
                              Please sign-in / register to see Complaint.
                            </p>{" "}
                            <ALink
                              href="/login"
                              className="btn btn-outline-primary-2"
                            >
                              <span>Sign In / Register</span>
                              <i className="icon-long-arrow-right"></i>
                            </ALink>
                          </>
                        )}

                        {coupon && (
                          <>
                            <p>See your avilable coupons from here.</p>

                            <div className="row">
                              {coupon && coupon.length && coupon.map((ele, index) => {
                                return (
                                  <div className="col-lg-6">
                                    <div className="card card-dashboard">
                                      <div className="card-body">
                                        <h3 className="card-title">
                                          {`coupon #${index + 1}`}
                                        </h3>

                                        <p>
                                          <strong>
                                            {" "}
                                            
                                            {ele.discount_type == "Flat" ?
                                              
                                             ele.discount_value  

                                            : ele.discount_value 
                                
                                            
                                            }
                                          </strong>{" "}
                                         
                                          <br />
                                          <strong>
                                            {" "}
                                            Code:

                                          </strong>{" "}

                                          {ele.coupon_code}

                                          <br />
                                          <strong>
                                            {" "}
                                            Minimum Cart Value:

                                          </strong>{" "}
                                          {ele.min_cart_value}

                                          <br />
                                          <strong>
                                            {" "}
                                            End Date:

                                          </strong>{" "}
                                          {moment(ele.end_date).format("YYYY-MM-DD")}

                                        </p>

                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}

                        {specificCoupon && (
                          <>
                            

                            <div className="row">
                              {specificCoupon && specificCoupon.length && specificCoupon.map((ele, index) => {
                                return (
                                  <div className="col-lg-6">
                                    <div className="card card-dashboard">
                                      <div className="card-body">
                                        <h3 className="card-title">
                                          {`coupon #${index + 1}`}
                                        </h3>

                                        <p>
                                          <strong>
                                            {" "}
                                            
                                            {ele.discount_type == "Flat" ?
                                              
                                             ele.discount_value  

                                            : ele.discount_value 
                                
                                            
                                            }
                                          </strong>{" "}
                                         
                                          <br />
                                          <strong>
                                            {" "}
                                            Code:

                                          </strong>{" "}

                                          {ele.coupon_code}

                                          <br />
                                          <strong>
                                            {" "}
                                            Minimum Cart Value:

                                          </strong>{" "}
                                          {ele.min_cart_value}

                                          <br />
                                          <strong>
                                            {" "}
                                            End Date:

                                          </strong>{" "}
                                          {moment(ele.end_date).format("YYYY-MM-DD")}

                                        </p>

                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}


                      </TabPanel> */}

                      {/* Complaint */}
                      <TabPanel>
                        {!user && (
                          <>
                            <p>Please sign-in / register to see Complaint.</p>{" "}
                            <ALink
                              href="/login"
                              className="btn btn-outline-primary-2"
                            >
                              <span>Sign In / Register</span>
                              <i className="icon-long-arrow-right"></i>
                            </ALink>
                          </>
                        )}
                        {complaint && (
                          <>
                            <p>See your complaint from here.</p>

                            <div className="row">
                              {complaint &&
                                complaint.length &&
                                complaint.map((ele, index) => {
                                  return (
                                    <div className="col-lg-6">
                                      <div className="card card-dashboard">
                                        <div className="card-body">
                                          <h3 className="card-title">
                                            {`Complaint #${index + 1}`}
                                          </h3>

                                          <p>
                                            <strong>
                                              {" "}
                                              Complaint No: {ele.complain_no}
                                            </strong>{" "}
                                            <br />
                                            <strong> Massage:</strong>{" "}
                                            {ele.message}
                                            <br />
                                            <strong> Status:</strong>{" "}
                                            {ele.status}
                                            <br />
                                            <strong> Update At:</strong>{" "}
                                            {moment(ele.updatedAt).format(
                                              "YYYY-MM-DD HH:mm"
                                            )}
                                            <br />
                                            <strong>
                                              {" "}
                                              Complaint Date:
                                            </strong>{" "}
                                            {moment(ele.createdAt).format(
                                              "YYYY-MM-DD HH:mm"
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </>
                        )}
                      </TabPanel>
                    </div>
                  </div>
                </div>
              </Tabs>
            </ul>
          </div>
        </div>
      </div>

      <Modal
        size="lg"
        isOpen={helpModal}
        toggle={() => sethelpModal(!helpModal)}
      >
        <ModalHeader toggle={() => sethelpModal(!helpModal)}>
          Complaint
        </ModalHeader>
        <ModalBody>
          <>
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    {/* <Row>
                      <Col lg={12}>
                        <p className="text-muted mb-2">
                          <b>Product Details </b>
                        </p>
                        <BootstrapTable

                          keyField="_id"
                          columns={columns_product_details}
                          data={productsDetails && productsDetails}
                          noDataIndication="No orders to display."
                          bootstrap4

                        />
                      </Col>
                    </Row> */}
                    <AvForm
                      onValidSubmit={(e, v) => {
                        handleValidSubmit(e, v);
                      }}
                    >
                      <Row>
                        <Col lg={12}>
                          <AvField
                            name="message"
                            placeholder="Write Complaint"
                            type="textarea"
                            required
                          />
                        </Col>

                        <Col lg={6}>
                          <hr />
                          <FormGroup className="mb-0 text-center">
                            <div>
                              <Button
                                type="submit"
                                color="primary"
                                className="mr-1"
                              >
                                Send
                              </Button>{" "}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col lg={6}>
                          <hr />
                          <FormGroup className="mb-0 text-center">
                            <div>
                              <Button
                                type="button"
                                color="info"
                                onClick={() => {
                                  sethelpModal(!helpModal);
                                }}
                              >
                                Cancel
                              </Button>{" "}
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </AvForm>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </>
        </ModalBody>
      </Modal>

      <Modal
        size="lg"
        isOpen={addressModal}
        toggle={() => setAddressModal(!addressModal)}
      >
        {/* <ModalHeader toggle={() => setAddressModal(!addressModal)}>
          Address:
        </ModalHeader> */}
        <ModalBody>
          <>
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <AvForm
                      onValidSubmit={(e, v) => {
                        handleValidAddress(e, v);
                      }}
                    >
                      <Row>
                        <Col lg={6}>
                          <AvField
                            name="apartment_house_number"
                            label={"Apartment/House No."}
                            placeholder={"Enter Apartment/House No."}
                            type="text"
                            errorMessage="Apartment/House No. cannot be empty."
                            required
                          />
                        </Col>
                        <Col lg={6}>
                          <AvField
                            name="street_address"
                            label={"Street Address"}
                            placeholder={"Enter Street Address"}
                            type="text"
                            errorMessage="Street address cannot be empty."
                            required
                          />
                        </Col>
                        <Col lg={6}>
                          <AvField
                            name="city"
                            label={"City"}
                            placeholder={"Enter Street Address"}
                            type="text"
                            errorMessage="City cannot be empty."
                            required
                          />
                        </Col>
                        <Col lg={6}>
                          <Label>Province</Label>
                          <Select options={options} />
                        </Col>
                        <Col lg={6}>
                          <AvField
                            name="pincode"
                            label={"Pincode"}
                            placeholder={"Enter Pincode"}
                            type="text"
                            validate={{
                              required: {
                                value: true,
                                errorMessage: "Pincode cannot be empty.",
                              },
                              pattern: {
                                value: "^[a-zA-Z0-9_]",
                                errorMessage: "Pincode require 6 characters.",
                              },

                              maxLength: {
                                value: 6,
                                errorMessage: "Pincode require 6 characters.",
                              },
                              minLength: {
                                value: 6,
                                errorMessage: "Pincode require 6 characters.",
                              },
                            }}
                          />
                        </Col>

                        <Col lg={12}>
                          <FormGroup className="mb-0 text-center">
                            <div>
                              <Button
                                type="submit"
                                color="primary"
                                className="mr-1"
                              >
                                {"Add"}
                              </Button>{" "}
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </AvForm>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default React.memo(DashBoard);
