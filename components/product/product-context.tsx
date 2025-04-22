'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import React, {
    createContext,
    useContext,
    useMemo,
    useOptimistic
} from 'react';
import {Product, ProductVariant} from 'lib/shopify/types';

type ProductState = {
    [key: string]: string;
} & {
    image?: string;
};

type ProductContextType = {
    state: ProductState;
    updateOption: (name: string, value: string) => ProductState;
    updateImage: (index: string) => ProductState;
    selectedVariant?: ProductVariant;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({
                                    children,
                                    product
                                }: {
    children: React.ReactNode;
    product: Product;
}) {
    const searchParams = useSearchParams();

    const getInitialState = () => {
        const params: ProductState = {};
        for (const [key, value] of searchParams.entries()) {
            params[key] = value;
        }

        // fallback: default to first value of each option
        if (product) {
            for (const option of product.options) {
                const key = option.name.toLowerCase();
                if (!params[key]) {
                    params[key] = option.values[0] ?? '';
                }
            }
        }

        return params;
    };

    const [state, setOptimisticState] = useOptimistic(
        getInitialState(),
        (prevState: ProductState, update: ProductState) => ({
            ...prevState,
            ...update
        })
    );

    const updateOption = (name: string, value: string) => {
        const newState = {[name]: value};
        setOptimisticState(newState);
        return {...state, ...newState};
    };

    const updateImage = (index: string) => {
        const newState = {image: index};
        setOptimisticState(newState);
        return {...state, ...newState};
    };

    const selectedVariant = useMemo(() => {
        return product.variants.find((variant) =>
            variant.selectedOptions.every((opt) => {
                const key = opt.name.toLowerCase();
                return state[key] === opt.value;
            })
        );
    }, [state, product]);

    const value: ProductContextType = useMemo(
        () => ({
            state,
            updateOption,
            updateImage,
            selectedVariant
        }),
        [state, selectedVariant]
    );

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProduct() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProduct must be used within a ProductProvider');
    }
    return context;
}

export function useUpdateURL() {
    const router = useRouter();

    return (state: ProductState) => {
        const newParams = new URLSearchParams(window.location.search);
        Object.entries(state).forEach(([key, value]) => {
            newParams.set(key, value);
        });
        router.push(`?${newParams.toString()}`, {scroll: false});
    };
}
