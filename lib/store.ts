import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Collection, Product } from "./shopify/types";

type Store = {
  products: Product[];
  collections: Collection[];
  setData: (data: { products: Product[]; collections: Collection[] }) => void;
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      products: [],
      collections: [],
      fetchData: async () => {
        // your fetch logic
      },
      setData: ({ products, collections }) => {
        set({ products, collections });
      },
    }),
    { name: "store-data" },
  ),
);
