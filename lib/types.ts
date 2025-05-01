export type Collection = {
    handle: string;
    title: string;
    position: number;
    updatedAt: string;
};

export type Image = {
    url: string;
    altText: string;
};

export type Product = {
    id: string;
    handle: string;
    collection: string;
    available: boolean;
    title: string;
    description: string;
    price: string;
    featuredImage: Image;
    images: Image[];
    updatedAt: string;
};

 
export type CartItem = {
    productId: string;
    handle: string;
    title: string;
    imageUrl: string;
    imageAlt: string;
    quantity: number;
    unitAmount: number;
    totalAmount: number;
};

export type Cart = {
    totalQuantity: number;
    lines: CartItem[];
    cost: number;
};

export type OrderInfo = {
    name: string;
    email: string;
    phone: number;
};

export type Order = OrderInfo & {
    cart: Cart;
};


