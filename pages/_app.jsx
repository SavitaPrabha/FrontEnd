import { useEffect } from "react";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";

import Helmet from "react-helmet";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import makeStore from "../store";
import Layout from "../components/layout";

import { actions as demoAction } from "../store/demo";

import "~/public/scss/plugins/owl-carousel/owl.carousel.scss";
import "~/public/scss/style.scss";

const App = ({ Component, pageProps, store }) => {
  useEffect(() => {
    if (store.getState().demo.current != process.env.NEXT_PUBLIC_DEMO) {
      store.dispatch(demoAction.refreshStore(process.env.NEXT_PUBLIC_DEMO));
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate
        persistor={store.__persistor}
        loading={
          <div className="loading-overlay">
            <div className="bounce-loader">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
        }
      >
        <Helmet>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="keywords" content="Molla React Template" />
          <meta name="description" content="ECom" />
          <meta name="author" content="d-themes" />
          <meta name="apple-mobile-web-app-title" content="Molla" />
          <meta name="application-name" content="ECom" />
          <meta name="msapplication-TileColor" content="#cc9966" />
          <meta
            name="msapplication-config"
            content="images/icons/browserconfig.xml"
          />
          <meta name="theme-color" content="#ffffff" />
          <title>ECom</title>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="images/icons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="images/icons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="images/icons/favicon-16x16.png"
          />
          <link rel="manifest" href="images/icons/site.webmanifest" />
          <link
            rel="mask-icon"
            href="images/icons/safari-pinned-tab.svg"
            color="#666666"
          />
          <link rel="shortcut icon" href="images/icons/favicon.ico" />
        </Helmet>

        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PersistGate>
    </Provider>
  );
};

App.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return { pageProps };
};

export default withRedux(makeStore)(withReduxSaga(App));
