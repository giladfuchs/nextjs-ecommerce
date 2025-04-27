import { Metadata } from "next";
import { notFound } from "next/navigation";

import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { getCollection, getCollectionProducts } from "../../../lib/api";

function safeDecodeURIComponent(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

export async function generateMetadata(props: {
    params: Promise<{ collection: string }>;
}): Promise<Metadata> {
    const params = await props.params;

    const collection = await getCollection(
        safeDecodeURIComponent(params.collection),
    );
    if (!collection) return notFound();

    return {
        title: collection.title,
        description:   `${collection.title} products`,
    };
}

export default async function CategoryPage(props: {
    params: Promise<{ collection: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await props.params;
    const searchParams = props.searchParams ? await props.searchParams : {};

    let { collection } = params;
    collection = safeDecodeURIComponent(collection);

    const products = await getCollectionProducts({ collection });

    const query = searchParams["q"];
    const queryText = Array.isArray(query) ? query[0] : query || "";

    const regex = queryText ? new RegExp(queryText, 'i') : null;


    const filteredProducts = queryText
        ? products.filter((product) =>
            regex!.test(Object.values(product).join(' '))
        )
        : products;

    return (
        <section>
            {filteredProducts.length === 0 ? (
                <p className="py-3 text-lg">No products found in this collection</p>
            ) : (
                <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <ProductGridItems products={filteredProducts} />
                </Grid>
            )}
        </section>
    );
}
