import { Order, OrderStatus, Product, Collection } from './types';
import { ModelType } from '../app/admin/form/form';
import { API_URL } from './utils';

let cachedData: { products: Product[]; collections: Collection[] } = {
    products: [],
    collections: [],
};
let lastFetched = 0;

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function serverFetch(
    input: string,
    init: RequestInit = {},
): Promise<Response> {
    const { next, redirect, headers, cache, ...restInit } = init as any;

    const isFormData =
        typeof headers === 'object' &&
        headers &&
        (headers['Content-Type'] === undefined ||
            headers['Content-Type']?.toString().includes('multipart/form-data'));

    const defaultHeaders: HeadersInit = isFormData
        ? headers || {}
        : {
            'Content-Type': 'application/json',
            ...(headers || {}),
        };

    return fetch(`${API_URL}${input}`, {
        ...restInit,
        headers: defaultHeaders,
        credentials: 'include',
        cache: cache || 'no-store',
    });
}

export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await serverFetch(`/auth/image`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('❌ Failed to upload image');
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
    const response = await serverFetch(`/auth/${model}/${idOrAdd}`, {
        method: 'POST',
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('❌ Failed to submit model');
        throw new Error(err?.error || 'Failed to submit model');
    }

    return response;
}

export async function submitOrder(order: Order): Promise<Response> {
    const response = await serverFetch(`/checkout`, {
        method: 'POST',
        body: JSON.stringify(order),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('❌ Failed to submit order');
        throw new Error(err?.error || 'Failed to submit order');
    }

    return response;
}

async function fetchData() {
    const now = Date.now();

    if (cachedData && now - lastFetched < CACHE_DURATION) {
        console.log('cachedData');
        return cachedData;
    }

    console.log('call to server');
    const response = await serverFetch(`/data`);

    if (!response.ok) {
        console.error('❌ Failed to fetch data');
        throw new Error('Failed to fetch data from API');
    }

    const data = await response.json();

    cachedData = data;
    lastFetched = now;

    return data;
}

export async function getOrders() {
    const response = await serverFetch(`/auth/orders`);

    if (!response.ok) {
        console.error('❌ Failed to fetch orders');
        throw new Error('Failed to fetch orders from API');
    }

    return response.json();
}

export async function getOrderById(id: number) {
    const res = await serverFetch(`/auth/order/${id}`);

    if (!res.ok) {
        console.error('❌ Failed to fetch order');
        return null;
    }

    return res.json();
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    const res = await serverFetch(`/auth/order/status`, {
        method: 'POST',
        body: JSON.stringify({ id, status }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('❌ Failed to update order status');
        throw new Error(err?.error || 'שגיאה בעדכון הסטטוס');
    }

    return res.json();
}

export async function loginUser(username: string, password: string): Promise<Response> {
    const response = await serverFetch(`/login`, {
        method: 'POST',
        body: JSON.stringify({ email: username, password }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('❌ Failed to login');
        throw new Error(err?.error || 'Login failed');
    }

    return response;
}

export async function getProducts(): Promise<Product[]> {
    const { products } = await fetchData();
    return products;
}

export async function getCollections(): Promise<Collection[]> {
    const { collections } = await fetchData();
    return collections;
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
    const collections = await getCollections();
    return collections.find((collection) => collection.handle === handle);
}

export async function getCollectionProducts({
                                                collection,
                                            }: {
    collection: string;
}): Promise<Product[]> {
    const products: Product[] = await getProducts();
    return products.filter((product: Product) => product.collection === collection);
}