import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem, Product } from 'lib/types';

function createEmptyCart(): Cart {
    return {
        totalQuantity: 0,
        lines: [],
        cost: '0.00',
    };
}

const initialState: Cart = createEmptyCart();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action: PayloadAction<{ product: Product }>) {
            const { product } = action.payload;
            const existingItem = state.lines.find(
                (item) => item.merchandise.id === product.id
            );

            const quantity = existingItem ? existingItem.quantity + 1 : 1;

            const updatedItem: CartItem = {
                id: existingItem?.id ?? product.id,
                quantity,
                cost: {
                    totalAmount: (Number(product.price) * quantity).toFixed(2),
                    unitAmount: product.price,
                },
                merchandise: {
                    id: product.id,
                    title: product.title,
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
                (sum, item) => sum + Number(item.cost.totalAmount),
                0
            );

            state.lines = updatedLines;
            state.totalQuantity = totalQuantity;
            state.cost = totalAmount.toFixed(2);
        },

        updateItem(
            state,
            action: PayloadAction<{ merchandiseId: string; updateType: 'plus' | 'minus' | 'delete' }>
        ) {
            const { merchandiseId, updateType } = action.payload;

            const updatedLines = state.lines
                .map((item) => {
                    if (item.merchandise.id !== merchandiseId) return item;

                    if (updateType === 'delete') return null;

                    const newQuantity =
                        updateType === 'plus' ? item.quantity + 1 : item.quantity - 1;

                    if (newQuantity <= 0) return null;

                    const unitPrice = Number(item.cost.unitAmount);
                    return {
                        ...item,
                        quantity: newQuantity,
                        cost: {
                            totalAmount: (unitPrice * newQuantity).toFixed(2),
                            unitAmount: item.cost.unitAmount,
                        },
                    };
                })
                .filter(Boolean) as CartItem[];

            const totalQuantity = updatedLines.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = updatedLines.reduce(
                (sum, item) => sum + Number(item.cost.totalAmount),
                0
            );

            state.lines = updatedLines;
            state.totalQuantity = totalQuantity;
            state.cost = updatedLines.length > 0 ? totalAmount.toFixed(2) : '0.00';
        },

        clearCart(state) {
            Object.assign(state, createEmptyCart());
        },
    },
});

export const { addItem, updateItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
