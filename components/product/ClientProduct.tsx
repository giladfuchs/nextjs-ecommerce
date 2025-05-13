"use client";

import Grid from "components/product/grid";
import ProductGridItems from "components/product/product-grid-items";
import {
  NoProductsMessage,
  SearchResultsMessage,
} from "components/shared/messages";
import { Product } from "lib/types";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function ClientProduct({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const filteredProducts = useMemo(() => {
    if (!q) return products;
    const regex = new RegExp(q, "i");
    return products.filter((product) =>
      regex.test(
        Object.values(product)
          .filter((value) => typeof value === "string")
          .join(" "),
      ),
    );
  }, [q, products]);

  return (
    <>
      {q && <SearchResultsMessage count={filteredProducts.length} />}
      {filteredProducts.length > 0 ? (
        <div className="container mx-auto px-4">
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={filteredProducts} />
          </Grid>
        </div>
      ) : (
        <NoProductsMessage />
      )}
    </>
  );
}
