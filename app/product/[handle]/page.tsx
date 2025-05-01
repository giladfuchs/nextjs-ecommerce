import { notFound } from "next/navigation";

import { Gallery } from "components/product/gallery";
import { ProductDescription } from "components/product/product-description";

import { Image } from "lib/types";
import { Suspense } from "react";
import { headers } from "next/headers";
import { getProducts } from "../../../lib/api";
import { Metadata } from "next";

async function getHandleFromHeaders(): Promise<string | null> {
  const headerList = await headers();
  return headerList.get("x-product-handle");
}

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const rawHandle = await getHandleFromHeaders();

  const handle = safeDecodeURIComponent(rawHandle as string);
  const product = (await getProducts()).find((p) => p.handle === handle);
  if (!product) {
    return {};
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [
        {
          url: product.featuredImage.url,
          width: 1200,
          height: 630,
          alt: product.featuredImage.altText || product.title,
        },
      ],
      type: "website",
    },
  };
}

export default async function ProductPage() {
  const rawHandle = await getHandleFromHeaders();
  const handle = safeDecodeURIComponent(rawHandle as string);
  const product = (await getProducts()).find((p) => p.handle === handle);

  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: "ILS",
      price: product.price,
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />

      <div className="mx-auto max-w-(--breakpoint-2xl) px-4">
        <div className="flex flex-col rounded-lg border border-theme bg-theme p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-theme dark:bg-theme-dark">
          <div className="basis-full lg:basis-2/6">
            <Suspense fallback={null}>
              <ProductDescription product={product} />
            </Suspense>
          </div>
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery
                images={product.images.slice(0, 5).map((image: Image) => ({
                  src: image.url,
                  altText: image.altText,
                }))}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
