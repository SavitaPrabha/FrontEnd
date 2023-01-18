import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";

export const actionTypes = {
  addToCart: "ADD_TO_CART",
  removeFromCart: "REMOVE_FROM_CART",
  resetCart: "RESET_CART",
  refreshStore: "REFRESH_STORE",
  updateCart: "UPDATE_CART",
};

const initialState = {
  data: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.addToCart:
      var findIndex = state.data.findIndex(
        (item) => item._id == action.payload.product._id
      );
      let qty = action.payload.qty ? action.payload.qty : 1;

      if (findIndex !== -1) {
        return {
          data: [
            ...state.data.reduce((acc, product, index) => {
              if (findIndex == index) {
                console.log("aa1", product);
                acc.push({
                  ...product,
                  qty: product.qty + qty,
                  is_assembly_charges: false,
                  sum: action.payload.product.price * (product.qty + qty),
                });
              } else {
                acc.push(product);
              }

              return acc;
            }, []),
          ],
        };
      } else {
        console.log("aa2", action.payload.product);

        return {
          data: [
            ...state.data,
            {
              ...action.payload.product,
              qty: qty,
              is_assembly_charges: false,
              price: action.payload.product.price,
              sum: qty * action.payload.product.price,
            },
          ],
        };
      }
    case actionTypes.removeFromCart:
      return {
        data: [
          ...state.data.filter((item) => {
            if (item._id !== action.payload.product._id) return true;
            if (item.name !== action.payload.product.name) return true;
            return false;
          }),
        ],
      };

    case actionTypes.updateCart:
      return {
        //data: [...action.payload.cartItems],
        data: [
          ...action.payload.cartItems.reduce((acc, product, index) => {
            acc.push({
              ...product,
              shippingCost:
                action.payload.shippingCost != -1
                  ? action.payload.shippingCost
                  : product.shippingCost,
              storeAddress:
                action.payload.storeAddress != -1
                  ? action.payload.storeAddress
                  : product.storeAddress,
              shippingAddress:
                action.payload.shippingAddress != -1
                  ? action.payload.shippingAddress
                  : product.shippingAddress,
              coupon_details:
                action.payload.coupon_details != -1
                  ? action.payload.coupon_details
                  : product.coupon_details,
              coupon_discount:
                action.payload.coupon_discount != -1
                  ? action.payload.coupon_discount
                  : product.coupon_discount,
                  hst:
                  action.payload.hst != -1
                    ? action.payload.hst
                    : product.hst,
            });

            return acc;
          }, []),
        ],
      };

    case actionTypes.resetCart:
      return {
        data: [],
      };

    case actionTypes.refreshStore:
      return initialState;

    default:
      return state;
  }
};

export const actions = {
  addToCart: (product, qty = 1) => ({
    type: actionTypes.addToCart,
    payload: {
      product: product,
      qty: qty,
    },
  }),

  removeFromCart: (product) => ({
    type: actionTypes.removeFromCart,
    payload: {
      product: product,
    },
  }),

  updateCart: (
    cartItems,
    shippingCost = -1,
    storeAddress = -1,
    shippingAddress = -1,
    coupon_details = -1,
    coupon_discount = -1,
    hst = -1
  ) => ({
    type: actionTypes.updateCart,
    payload: {
      cartItems: cartItems,
      shippingCost: shippingCost,
      storeAddress: storeAddress,
      shippingAddress: shippingAddress,
      coupon_details: coupon_details,
      coupon_discount: coupon_discount,
      hst: hst,
    },
  }),

  resetCart: () => ({
    type: actionTypes.resetCart,
    payload: {},
  }),
};

export function* cartSaga() {
  yield takeEvery(actionTypes.addToCart, function* saga(e) {
    toast.success("Product added to Cart");
  });

  yield takeEvery(actionTypes.removeFromCart, function* saga(e) {
    toast.success("Product removed from Cart");
  });

  yield takeEvery(actionTypes.updateCart, function* saga(e) {
    //toast.success("Cart updated successfully");
  });

  yield takeEvery(actionTypes.resetCart, function* saga(e) {
    //toast.success("Cart updated successfully");
  });
}

const persistConfig = {
  keyPrefix: "molla-",
  key: "cart",
  storage,
};

export default persistReducer(persistConfig, cartReducer);
