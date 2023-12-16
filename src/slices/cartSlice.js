import { createSlice } from "@reduxjs/toolkit";
import { useSelector, shallowEqual } from "react-redux";
import { useActions } from "../hooks/useAction";

export const initialState = {
  cart: [],
  totalAmount: 0,
};

const calculateTotalAmount = (state) => {
  let totalAmount = state.cart.reduce((price, item) => {
    return price + item.product.price * item.quantity;
  }, 0);
  return totalAmount;
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetState: () => {
      return initialState;
    },
    addItem: (state, action) => {
      //first checking if the similar item already exists in the cart
      //if it does then increment the quantity else add item.
      let index = state.cart.findIndex(
        (object) => object.product._id === action.payload.item._id
      );
      if (index === -1) {
        state.cart = [
          ...state.cart,
          { product: action.payload.item, quantity: action.payload.quantity },
        ];
      } else {
        state.cart[index].quantity += action.payload.quantity;
      }
      state.totalAmount = calculateTotalAmount(state);
    },
    removeItem: (state, action) => {
      let newCart = state.cart.filter(
        (item) => item.product._id !== action.payload.id
      );
      state.cart = newCart;
      state.totalAmount = calculateTotalAmount(state);
    },
    decrementQuantity: (state, action) => {
      //finding the index of the product
      let index = state.cart.findIndex(
        (object) => object.product._id === action.payload.id
      );

      state.cart[index].quantity -= 1; //decrementing by one
      state.totalAmount = calculateTotalAmount(state); //updating totalAmount
    },
  },
});

export const actions = cartSlice.actions;

export const useCartStateActions = () => useActions({ actions });

const cartSelector = (state) => state.cart;
export const useCartState = () => useSelector(cartSelector, shallowEqual);

export default cartSlice.reducer;
