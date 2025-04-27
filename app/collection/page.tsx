"use client";

import { useEffect, useState } from "react";
import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { Product } from "lib/types";
import { getProducts } from "lib/api"; // ✅ Import real helper

function safeDecodeURIComponent(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

export default function CollectionPage() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function loadProducts() {
            const fetchedProducts = await getProducts();
            setProducts(fetchedProducts);
        }

        loadProducts();
    }, []);

    const pathname =
        typeof window !== "undefined"
            ? safeDecodeURIComponent(window.location.pathname)
            : "/";

    const collectionMatch = pathname.match(/^\/collection\/([^/]+)$/);
    const collectionHandle = collectionMatch ? collectionMatch[1] : null;

    const filteredProducts = collectionHandle && collectionHandle !== "all"
        ? products.filter((product) => product.collection === collectionHandle)
        : products;

    const resultsText = filteredProducts.length === 1 ? "result" : "results";

    return (
        <>
            <p className="mb-4">
                Showing {filteredProducts.length} {resultsText}
            </p>

            {filteredProducts.length > 0 ? (
                <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <ProductGridItems products={filteredProducts} />
                </Grid>
            ) : (
                <p>No products found.</p>
            )}
        </>
    );
}
