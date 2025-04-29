import {baseUrl, validateEnvironmentVariables} from "lib/utils";
import {MetadataRoute} from "next";
import {getCollections, getProducts} from "../lib/api";

type Route = {
    url: string;
    lastModified: string;
};

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    validateEnvironmentVariables();

    const routesMap = [""].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
    }));

    const collectionsPromise = getCollections().then((collections) =>
        collections.map((collection) => ({
            url: `${baseUrl}/collection/${collection.handle}`,
            lastModified: collection.updatedAt,
        })),
    );

    const productsPromise = getProducts().then((products) =>
        products.map((product) => ({
            url: `${baseUrl}/product/${product.handle}`,
            lastModified: product.updatedAt,
        })),
    );

    let fetchedRoutes: Route[] = [];

    try {
        fetchedRoutes = (
            await Promise.all([collectionsPromise, productsPromise])
        ).flat();
    } catch (error) {
        throw JSON.stringify(error, null, 2);
    }

    return [...routesMap, ...fetchedRoutes];
}
