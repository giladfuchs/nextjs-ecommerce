"use client";

import React, {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import {Product} from "lib/types";
import {getProducts} from "lib/api";
import {Typography} from "@mui/material"; // ✅ Import real helper

function safeDecodeURIComponent(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

export default function CollectionPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const searchParams = useSearchParams();

    const q = searchParams.get("q") || "";

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

    // ✅ First filter by collection
    let filteredProducts =
        collectionHandle && collectionHandle !== "all"
            ? products.filter((product) => product.collection === collectionHandle)
            : products;

    if (q) {
        const regex = q ? new RegExp(q, "i") : null;
        filteredProducts = filteredProducts.filter((product) =>
            regex!.test(Object.values(product).join(" ")),
        );
    }

    return (
        <>
            {q && (
                <Typography
                    variant="h5"
                    textAlign="center"
                    fontWeight="bold"
                    mb={2}
                    color="black"
                >
                    נמצאו
                    {"  "}
                    {filteredProducts.length} {"  "}
                    מוצרים
                </Typography>
            )}

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
