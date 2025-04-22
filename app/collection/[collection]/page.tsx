import {getCollection, getCollectionProducts} from 'lib/shopify';
import {Metadata} from 'next';
import {notFound} from 'next/navigation';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';

export async function generateMetadata(props: {
    params: Promise<{ collection: string }>;
}): Promise<Metadata> {
    const params = await props.params;

    const collection = await getCollection(params.collection);
    if (!collection) return notFound();

    return {
        title: collection.title,
        description: collection.description || `${collection.title} products`
    };
}

export default async function CategoryPage(props: {
    params: Promise<{ collection: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await props.params;

    const {collection} = params;
    const products = await getCollectionProducts({collection});

    return (
        <section>
            {products.length === 0 ? (
                <p className="py-3 text-lg">No products found in this collection</p>
            ) : (
                <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <ProductGridItems products={products}/>
                </Grid>
            )}
        </section>
    );
}

