import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cart, CartItem, Product } from "lib/types";
import { createTransform } from "redux-persist";
import { SEVEN_DAYS } from "../config";

function createEmptyCart(): Cart {
  return {
    totalQuantity: 0,
    lines: [],
    cost: 0,
    createdAt: Date.now(),
  };
}

const initialState: Cart = createEmptyCart();

export const resetCartTransform = createTransform(
  (inboundState) => inboundState,
  (outboundState: any) => {
    const isExpired = Date.now() - outboundState.createdAt > SEVEN_DAYS;
    return isExpired ? createEmptyCart() : { ...outboundState };
  },
  { whitelist: ["cart"] },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<{ product: Product }>) {
      const { product } = action.payload;
      const existingItem = state.lines.find(
        (item) => item.productId === product.id,
      );
      const quantity = existingItem ? existingItem.quantity + 1 : 1;

      const updatedItem: CartItem = {
        productId: product.id,
        handle: product.handle,
        title: product.title,
        imageUrl: product.featuredImage.url,
        imageAlt: product.featuredImage.altText,
        quantity,
        unitAmount: product.price,
        totalAmount: product.price * quantity,
      };

      const updatedLines = existingItem
        ? state.lines.map((item) =>
            item.productId === product.id ? updatedItem : item,
          )
        : [...state.lines, updatedItem];

      const totalQuantity = updatedLines.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const totalAmount = updatedLines.reduce(
        (sum, item) => sum + item.totalAmount,
        0,
      );

      state.lines = updatedLines;
      state.totalQuantity = totalQuantity;
      state.cost = totalAmount;
    },

    updateItem(
      state,
      action: PayloadAction<{
        productId: string;
        updateType: "plus" | "minus" | "delete";
      }>,
    ) {
      const { productId, updateType } = action.payload;

      const updatedLines = state.lines
        .map((item) => {
          if (item.productId !== productId) return item;

          if (updateType === "delete") return null;

          const newQuantity =
            updateType === "plus" ? item.quantity + 1 : item.quantity - 1;

          if (newQuantity <= 0) return null;

          return {
            ...item,
            quantity: newQuantity,
            totalAmount: item.unitAmount * newQuantity,
          };
        })
        .filter(Boolean) as CartItem[];

      const totalQuantity = updatedLines.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const totalAmount = updatedLines.reduce(
        (sum, item) => sum + item.totalAmount,
        0,
      );

      state.lines = updatedLines;
      state.totalQuantity = totalQuantity;
      state.cost = updatedLines.length > 0 ? totalAmount : 0;
    },

    clearCart(state) {
      Object.assign(state, createEmptyCart());
    },
  },
});

export const { addItem, updateItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
