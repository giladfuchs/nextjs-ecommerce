"use client";

import { createContext, useContext, useMemo, useReducer } from "react";

import type {
  Cart,
  CartItem,
  Product,
  ProductVariant,
} from "lib/shopify/types";

// Types

type UpdateType = "plus" | "minus" | "delete";

type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: { merchandiseId: string; updateType: UpdateType };
    }
  | {
      type: "ADD_ITEM";
      payload: { variant: ProductVariant; product: Product };
    };

type CartContextType = {
  cart: Cart;
  addCartItem: (variant: ProductVariant, product: Product) => void;
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
};

// Context

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helpers

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toFixed(2);
}

function updateCartItem(
  item: CartItem,
  updateType: UpdateType,
): CartItem | null {
  if (updateType === "delete") return null;
  const newQuantity =
    updateType === "plus" ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;
  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(
    newQuantity,
    singleItemAmount.toString(),
  );

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount,
      },
    },
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product,
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id ?? variant.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
  };
}

function updateCartTotals(
  lines: CartItem[],
): Pick<Cart, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0,
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "USD";

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toFixed(2), currencyCode },
      totalAmount: { amount: totalAmount.toFixed(2), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

function createEmptyCart(): Cart {
  return {
    id: "mock-cart-id",
    checkoutUrl: "",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "ILS" },
      totalAmount: { amount: "0", currencyCode: "ILS" },
      totalTaxAmount: { amount: "0", currencyCode: "ILS" },
    },
  };
}
function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "UPDATE_ITEM": {
      const { merchandiseId, updateType } = action.payload;
      const updatedLines = state.lines
        .map((item) =>
          item.merchandise.id === merchandiseId
            ? updateCartItem(item, updateType)
            : item,
        )
        .filter(Boolean) as CartItem[];

      return {
        ...state,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }

    case "ADD_ITEM": {
      const { variant, product } = action.payload;
      const existingItem = state.lines.find(
        (item) => item.merchandise.id === variant.id,
      );
      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product,
      );
      const updatedLines = existingItem
        ? state.lines.map((item) =>
            item.merchandise.id === variant.id ? updatedItem : item,
          )
        : [...state.lines, updatedItem];

      return {
        ...state,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }

    default:
      return state;
  }
}

export function CartProvider({
  children,

}: {
  children: React.ReactNode;

}) {
  const [cart, dispatch] = useReducer(cartReducer, createEmptyCart());

  const addCartItem = (variant: ProductVariant, product: Product) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { variant, product },
    });
  };

  const updateCartItem = (merchandiseId: string, updateType: UpdateType) => {
    dispatch({
      type: "UPDATE_ITEM",
      payload: { merchandiseId, updateType },
    });
  };

  const value = useMemo(
    () => ({
      cart,
      addCartItem,
      updateCartItem,
    }),
    [cart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
