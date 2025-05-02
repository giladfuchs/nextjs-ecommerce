import { Product, Collection } from "lib/types";

import type { Order } from "lib/types";
import { ModelType } from "../app/admin/form/form";
import { API_URL } from "./utils";

let cachedData: { products: Product[]; collections: Collection[] } = {
  products: [],
  collections: [],
};
let lastFetched = 0;

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_URL}/auth/image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error || 'Failed to upload image');
  }

  const data = await response.json();
  return data.url as string;
}
export async function submitModel(
  model: ModelType,
  idOrAdd: string,
  body: any,
): Promise<Response> {
  const response = await fetch(`${API_URL}/auth/${model}/${idOrAdd}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to submit model");
  }

  return response;
}

export async function submitOrder(order: Order): Promise<Response> {
  const response = await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to submit order");
  }

  return response;
}
async function fetchData() {
  const now = Date.now();

  if (cachedData && now - lastFetched < CACHE_DURATION) {
    console.log("cachedData")

      return cachedData;
  }
  console.log("call to server")
  const response = await fetch(`${API_URL}/data`, { cache: "no-store" }); // ✅ always fresh
  if (!response.ok) {
    throw new Error("Failed to fetch data from API");
  }

  const data = await response.json();
  // const data = mockJson

  cachedData = data;
  lastFetched = now;

  return data;
}
export async function getOrders() {
  const response = await fetch(`${API_URL}/auth/orders`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders from API");
  }

  return response.json();
}

export async function getProducts(): Promise<Product[]> {
  const { products } = await fetchData();
  return products;
}

export async function getCollections(): Promise<Collection[]> {
  const { collections } = await fetchData();

  return collections;
}

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  const collections = await getCollections();
  return collections.find((collection) => collection.handle === handle);
}

export async function getCollectionProducts({
  collection,
}: {
  collection: string;
}): Promise<Product[]> {
  const products: Product[] = await getProducts();
  return products.filter(
    (product: Product) => product.collection === collection,
  );
}
