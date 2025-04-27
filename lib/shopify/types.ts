export type Money = {
    amount: string;
    currencyCode: string;
};

export type Image = {
    url: string;
    altText: string;
    width: number;
    height: number;
};



export type Product = {
    id: string;
    handle: string;
    availableForSale: boolean;
    title: string;
    description: string;
    price: Money;
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
        totalAmount: Money;
        unitAmount: Money;
    };
    merchandise: {
        id: string;
        title: string;
        selectedOptions: {
            name: string;
            value: string;
        }[];
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
    description: string;
    updatedAt: string;
    path: string;
};
