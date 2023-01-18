module.exports = {
  basePath: process.env.NODE_ENV === "production" ? "" : "",
  trailingSlash: false,
  env: {
    PUBLIC_URL: process.env.NODE_ENV === "production" ? "/" : "/",
    APP_URL:
      process.env.NODE_ENV === "production"
        ? "http://localhost/"
        : "http://localhost/",
  },
};
