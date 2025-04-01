import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";
const initialState = localStorage.getItem("cart") ?
    JSON.parse(localStorage.getItem("cart")) :
    { cartItems: [], shippingAddress: {}, paymentMathod: "PayPal" };

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            // console.log("item  action.payload===>", item);
            const existItem = state.cartItems.find((i) => i._id === item._id)
            // console.log("existItem ====>", existItem);

            if (existItem) {
                state.cartItems = state.cartItems.map((i) => i._id === existItem._id ? item : i)
            } else {
                state.cartItems = [...state.cartItems, item]
            }
            return updateCart(state)
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(i => i._id !== action.payload)
            return updateCart(state)
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            return updateCart(state)
        },
        savePaymentMethod: (state, action) => {
            state.paymentMathod = action.payload
            return updateCart(state)
        },
        clearCartItems: (state, action) => {
            state.cartItems = [];
            return updateCart(state)
        }
    }
})

export const {
    addToCart,
    removeFromCart,
    saveShippingAddress,
    savePaymentMethod,
    clearCartItems
} = cartSlice.actions
export default cartSlice.reducer;