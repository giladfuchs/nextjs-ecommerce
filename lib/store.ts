import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {Collection, Product} from "./shopify/types";

type Store = {
    products: Product[];
    collections: Collection[];
    setData: (data: { products: Product[], collections: Collection[] }) => void;
};

export const useStore = create<Store>()(
    persist(
        (set) => ({
            products: [],
            collections: [],
            fetchData: async () => {
                const res = await fetch('http://localhost:8000/data');
                const data = await res.json();
                set({ products: data.products, collections: data.collections });
            }
        }),
        {
            name: 'planet-store', // localStorage key
            skipHydration: true
        }
    )
);

