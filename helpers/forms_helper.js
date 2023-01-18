import axios from "axios";
import store from "store";

// Submit Form
const postSubmitForm = (url, data) => {
  const token = store.get("user") ? store.get("user").token : "";

  const config = {
    headers: { Authorization: token },
  };
  return axios
    .post(url, data, config)
    .then((response) => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch((err) => {
      var message;
      console.log(err);
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};
export { postSubmitForm };

// Submit Form Without Auth
const postSubmitFormNoAuth = (url, data) => {
  return axios
    .post(url, data)
    .then((response) => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch((err) => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};
export { postSubmitFormNoAuth };

// Submit Form with form-data
const postSubmitForm_withformdata = (url, data) => {
  //console.log(data);

  const token = store.get("user") ? store.get("user").token : "";
  const config = {
    headers: { Authorization: token },
  };
  return axios
    .post(url, data, config)
    .then((response) => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch((err) => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};
export { postSubmitForm_withformdata };

const getGeoInfo = async () => {
  let response = await axios.get("https://ipapi.co/json/");
  return response.data;
};

export { getGeoInfo };
