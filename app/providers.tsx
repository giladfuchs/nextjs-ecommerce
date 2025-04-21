'use client';

import { CartProvider } from 'components/cart/cart-context';
import {Cart} from "../lib/shopify/types";
function createEmptyCart(): Cart {
    return {
        id: 'mock-cart-id',
        checkoutUrl: '',
        totalQuantity: 0,
        lines: [],
        cost: {
            subtotalAmount: { amount: '0', currencyCode: 'USD' },
            totalAmount: { amount: '0', currencyCode: 'USD' },
            totalTaxAmount: { amount: '0', currencyCode: 'USD' }
        }
    };
}
export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider initialCart={createEmptyCart()}>
            {children}
        </CartProvider>
    );
}
