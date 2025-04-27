import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Cart, CartItem, Product, ProductVariant} from 'lib/shopify/types';

// Helpers

function createOrUpdateCartItem(
    existingItem: CartItem | undefined,
    variant: ProductVariant,
    product: Product
): CartItem {
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    const unitPrice = Number(variant.price.amount);
    const totalAmount = (unitPrice * quantity).toFixed(2);

    return {
        id: existingItem?.id ?? variant.id,
        quantity,
        cost: {
            unitAmount: {
                amount: unitPrice.toFixed(2),
                currencyCode: variant.price.currencyCode,
            },
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

function updateCartItem(
    item: CartItem,
    updateType: 'plus' | 'minus' | 'delete'
): CartItem | null {
    if (updateType === 'delete') return null;
    const newQuantity = updateType === 'plus' ? item.quantity + 1 : item.quantity - 1;
    if (newQuantity === 0) return null;

    const unitPrice = Number(item.cost.unitAmount.amount);
    const newTotalAmount = (unitPrice * newQuantity).toFixed(2);

    return {
        ...item,
        quantity: newQuantity,
        cost: {
            ...item.cost,
            totalAmount: {
                amount: newTotalAmount,
                currencyCode: item.cost.unitAmount.currencyCode,
            },
        },
    };
}

function updateCartTotals(lines: CartItem[]): Pick<Cart, 'totalQuantity' | 'cost'> {
    const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = lines.reduce(
        (sum, item) => sum + Number(item.cost.totalAmount.amount),
        0
    );
    const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? 'ILS';

    return {
        totalQuantity,
        cost: {
            totalAmount: {
                amount: totalAmount.toFixed(2),
                currencyCode,
            },
        },
    };
}

function createEmptyCart(): Cart {
    return {
        totalQuantity: 0,
        lines: [],
        cost: {
            totalAmount: {amount: '0', currencyCode: 'ILS'},
        },
    };
}

const initialState: Cart = createEmptyCart();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action: PayloadAction<{ variant: ProductVariant; product: Product }>) {
            const {variant, product} = action.payload;
            const existingItem = state.lines.find(
                (item) => item.merchandise.id === variant.id
            );
            const updatedItem = createOrUpdateCartItem(existingItem, variant, product);
            const updatedLines = existingItem
                ? state.lines.map((item) =>
                    item.merchandise.id === variant.id ? updatedItem : item
                )
                : [...state.lines, updatedItem];

            const totals = updateCartTotals(updatedLines);
            state.lines = updatedLines;
            state.totalQuantity = totals.totalQuantity;
            state.cost = totals.cost;
        },

        updateItem(state, action: PayloadAction<{ merchandiseId: string; updateType: 'plus' | 'minus' | 'delete' }>) {
            const {merchandiseId, updateType} = action.payload;
            const updatedLines = state.lines
                .map((item) =>
                    item.merchandise.id === merchandiseId
                        ? updateCartItem(item, updateType)
                        : item
                )
                .filter(Boolean) as CartItem[];

            const totals = updateCartTotals(updatedLines);
            state.lines = updatedLines;
            state.totalQuantity = totals.totalQuantity;
            state.cost = totals.cost;
        },

        clearCart(state) {
            Object.assign(state, createEmptyCart());
        },
    },
});

export const {addItem, updateItem, clearCart} = cartSlice.actions;
export default cartSlice.reducer;
