import {Product, Collection} from "lib/types";
import mockJson from "./mock_products.json";


const API_URL = "http://0.0.0.0:5002/data"; // ✅ Your fastapi endpoint

let cachedData: { products: Product[]; collections: Collection[] }  = { products: [],collections: [] };
let lastFetched = 0;

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function fetchData() {
    const now = Date.now();

    if (cachedData && now - lastFetched < CACHE_DURATION) {
        return cachedData;
    }

    // const response = await fetch(API_URL, {cache: "no-store"}); // ✅ always fresh
    // if (!response.ok) {
    //     throw new Error("Failed to fetch data from API");
    // }
    //
    // const data = await response.json();
    const data = mockJson

    cachedData = data
    lastFetched = now;

    return data;
}

export async function getProducts(): Promise<Product[]> {
    const {products} = await fetchData();
    return products;
}

export async function getCollections(): Promise<Collection[]> {
    const {collections} = await fetchData();

    return collections;
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
    const collections = await getCollections();
    return collections.find((collection) => collection.handle === handle);
}

export async function getCollectionProducts({collection}: { collection: string }): Promise<Product[]> {
    const products: Product[] = await getProducts();
    return products.filter((product: Product) => product.collection === collection);
}