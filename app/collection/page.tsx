"use client";

import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import {mockProducts} from "lib/shopify";

function safeDecodeURIComponent(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

export default function CollectionPage() {

    const pathname =
        typeof window !== "undefined"
            ? safeDecodeURIComponent(window.location.pathname)
            : "/";

    const collectionMatch = pathname.match(/^\/collection\/([^/]+)$/);
    const collectionHandle = collectionMatch ? collectionMatch[1] : null;

    let filteredProducts = mockProducts;

    if (collectionHandle && collectionHandle !== "all") {
        filteredProducts = filteredProducts.filter(
            (product) => product.collection === collectionHandle
        );
    }

    const resultsText = filteredProducts.length === 1 ? "result" : "results";

    return (
        <>
            {/* Load mock into Redux only once */}

            <p className="mb-4">
                Showing {filteredProducts.length} {resultsText}
                {collectionHandle ? ` in "${collectionHandle}"` : null}
            </p>

            {filteredProducts.length > 0 ? (
                <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <ProductGridItems products={filteredProducts}/>
                </Grid>
            ) : (
                <p>No products found.</p>
            )}
        </>
    );
}
