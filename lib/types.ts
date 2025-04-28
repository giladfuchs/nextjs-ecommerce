export type Money = {
    amount: string;
};

export type Image = {
    url: string;
    altText: string;
};



export type Product = {
    id: string;
    handle: string;
    collection: string;
    availableForSale: boolean;
    title: string;
    description: string;
    price: string;
    featuredImage: Image;
    images: Image[];
    tags: string[];
    updatedAt: string;
};

export type CartProduct = {
    id: string;
    handle: string;
    title: string;
    featuredImage: Image;
};

export type CartItem = {
    id: string | undefined;
    quantity: number;
    cost: {
        totalAmount: string;
        unitAmount: string;
    };
    merchandise: {
        id: string;
        title: string;
        product: CartProduct;
    };
};

export type Cart = {
    totalQuantity: number;
    lines: CartItem[];
    cost: {
        totalAmount: Money;
    };
};

export type Menu = {
    title: string;
    path: string;
};

export type Collection = {
    handle: string;
    title: string;
    updatedAt: string;
    path: string;
};
