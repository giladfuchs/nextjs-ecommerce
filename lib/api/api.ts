import {Order, OrderStatus, ModelType} from "../types";
import {API_URL} from "../config";
import {cache} from "./cache";

async function serverFetch(
    input: string,
    init: RequestInit = {},
): Promise<Response> {
    const {
        next,
        redirect,
        headers,
        cache: initCache,
        body,
        ...restInit
    } = init as any;

    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

    let finalBody = body;
    let finalHeaders: HeadersInit = headers || {};

    if (body && !(body instanceof FormData)) {
        finalBody = JSON.stringify(body);
        finalHeaders = {
            "Content-Type": "application/json",
            ...finalHeaders,
        };
    }

    if (token) {
        finalHeaders = {
            ...finalHeaders,
            Authorization: `Bearer ${token}`,
        };
    }

    return fetch(`${API_URL}${input}`, {
        ...restInit,
        headers: finalHeaders,
        body: finalBody,
        credentials: "include",
        cache: initCache || "no-store",
    });
}

async function handleResponse<T = any>(response: Response, context: string): Promise<T> {
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error(`❌ Failed to ${context}`);
        throw new Error(err?.error || `Failed to ${context}`);
    }
    return response.json();
}

export async function fetchData(force = false) {
    if (!force && cache.isFresh()) {
        console.log("✅ Using cached data");
        return cache.get();
    }

    const inflight = cache.getInFlight();
    if (!force && inflight) {
        console.log("🔄 Waiting on in-flight fetch");
        return inflight;
    }

    console.log("🌐 Fetching fresh data from server...");
    const promise = serverFetch(`/data`)
        .then((res) => handleResponse(res, "fetch data").then((data) => {
            cache.set(data);
            return data;
        }))
        .finally(() => {
            cache.setInFlight(null);
        });

    cache.setInFlight(promise);
    return promise;
}

export async function deleteModel(model: ModelType, id: number): Promise<void> {
    const res = await serverFetch(`/auth/${model}/${id}`, {
        method: "DELETE",
    });
    await handleResponse(res, "delete model");
}

export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const res = await serverFetch(`/auth/image`, {
        method: "POST",
        body: formData,
    });

    const data = await handleResponse<{ url: string }>(res, "upload image");
    return data.url;
}

export async function submitModel(
    model: ModelType,
    idOrAdd: string,
    body: any,
): Promise<Response> {
    const res = await serverFetch(`/auth/${model}/${idOrAdd}`, {
        method: "POST",
        body,
    });

    return await handleResponse(res, "submit model");
}

export async function submitOrder(order: Order): Promise<Response> {
    const res = await serverFetch(`/checkout`, {
        method: "POST",
        body: order,
    });

    return await handleResponse(res, "submit order"); // ✅ returns parsed Order

}

export async function getOrders(): Promise<Order[]> {
    const res = await serverFetch(`/auth/orders`);
    return handleResponse(res, "fetch orders");
}

export async function getOrderById(id: number): Promise<Order | null> {
    const res = await serverFetch(`/auth/order/${id}`);
    if (!res.ok) {
        console.error("❌ Failed to fetch order");
        return null;
    }
    return res.json();
}

export async function updateOrderStatus(
    id: number,
    status: OrderStatus,
): Promise<Order> {
    const res = await serverFetch(`/auth/order/status`, {
        method: "POST",
        body: {id, status},
    });

    return handleResponse(res, "update order status");
}

export async function loginUser(
    username: string,
    password: string,
): Promise<{ token: string }> {
    const res = await serverFetch(`/login`, {
        method: "POST",
        body: {username, password},
    });

    return handleResponse(res, "login");
}