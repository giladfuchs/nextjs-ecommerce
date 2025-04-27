import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Cart, CartItem, Product} from 'lib/types';

// Helpers
function createEmptyCart(): Cart {
    return {
        totalQuantity: 0,
        lines: [],
        cost: {
            totalAmount: {amount: '0', currencyCode: 'ILS'},
        },
    };
}

// Slice
const initialState: Cart = createEmptyCart();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action: PayloadAction<{ product: Product }>) {
            const {product} = action.payload;

            const existingItem = state.lines.find(
                (item) => item.merchandise.id === product.id
            );

            const quantity = existingItem ? existingItem.quantity + 1 : 1;
            console.log(product)
            const updatedItem: CartItem = {
                id: existingItem?.id ?? product.id,
                quantity,
                cost: {
                    totalAmount: {
                        amount: (Number(product.price.amount) * quantity).toFixed(2),
                        currencyCode: product.price.currencyCode,
                    },
                    unitAmount: {
                        amount: product.price.amount,
                        currencyCode: product.price.currencyCode,
                    },
                },
                merchandise: {
                    id: product.id,
                    title: product.title,
                    selectedOptions: [], // ✅ ADD THIS LINE
                    product: {
                        id: product.id,
                        handle: product.handle,
                        title: product.title,
                        featuredImage: product.featuredImage,
                    },
                },
            };


            const updatedLines = existingItem
                ? state.lines.map((item) =>
                    item.merchandise.id === product.id ? updatedItem : item
                )
                : [...state.lines, updatedItem];

            const totalQuantity = updatedLines.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = updatedLines.reduce(
                (sum, item) => sum + Number(item.cost.totalAmount.amount),
                0
            );

            state.lines = updatedLines;
            state.totalQuantity = totalQuantity;
            state.cost.totalAmount = {
                amount: totalAmount.toFixed(2),
                currencyCode: product.price.currencyCode,
            };
        },

        updateItem(state, action: PayloadAction<{ merchandiseId: string; updateType: "plus" | "minus" | "delete" }>) {
            const {merchandiseId, updateType} = action.payload;

            const updatedLines = state.lines
                .map((item) => {
                    if (item.merchandise.id !== merchandiseId) return item;

                    const newQuantity =
                        updateType === "plus" ? item.quantity + 1 : item.quantity - 1;

                    if (newQuantity <= 0) return null;

                    const unitPrice = Number(item.cost.unitAmount.amount);
                    return {
                        ...item,
                        quantity: newQuantity,
                        cost: {
                            ...item.cost,
                            totalAmount: {
                                ...item.cost.totalAmount,
                                amount: (unitPrice * newQuantity).toFixed(2),
                            },
                        },
                    };
                })
                .filter(Boolean) as CartItem[];

            const totalQuantity = updatedLines.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = updatedLines.reduce(
                (sum, item) => sum + Number(item.cost.totalAmount.amount),
                0
            );

            state.lines = updatedLines;
            state.totalQuantity = totalQuantity;
            if (updatedLines.length > 0) {
                state.cost.totalAmount = {
                    amount: totalAmount.toFixed(2),
                    currencyCode: updatedLines[0].cost.totalAmount.currencyCode,
                };
            } else {
                state.cost.totalAmount = {amount: '0', currencyCode: 'ILS'};
            }
        },

        clearCart(state) {
            Object.assign(state, createEmptyCart());
        },
    },
});

export const {addItem, updateItem, clearCart} = cartSlice.actions;
export default cartSlice.reducer;
