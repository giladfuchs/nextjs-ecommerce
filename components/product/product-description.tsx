"use client";

import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import { Product } from "lib/types";
import clsx from "clsx";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="w-fit rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price amount={product.price} />
        </div>
      </div>

      {product.description ? (
        <div
          className={clsx(
            "prose mx-auto mb-6 max-w-6xl text-lg leading-7 text-black dark:prose-invert",
          )}
          dangerouslySetInnerHTML={{ __html: `<p>${product.description}</p>` }}
        />
      ) : null}

      <AddToCart product={product} />
    </>
  );
}
