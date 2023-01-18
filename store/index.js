import { combineReducers, createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./root-saga.js";
import { persistStore } from "redux-persist";

// Import Reducers
import cartReducer from "./cart";
import wishlistReducer from "./wishlist";
import compareReducer from "./compare";
import demoReducer from "./demo";

const sagaMiddleware = createSagaMiddleware();

const rootReducers = combineReducers({
  cartlist: cartReducer,
  wishlist: wishlistReducer,
  comparelist: compareReducer,
  demo: demoReducer,
});

const makeStore = (initialState, options) => {
  const store = createStore(rootReducers, applyMiddleware(sagaMiddleware));

  store.sagaTask = sagaMiddleware.run(rootSaga);
  store.__persistor = persistStore(store);
  return store;
};

export default makeStore;
