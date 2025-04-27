export type Maybe<T> = T | null;

export type Connection<T> = {
    edges: Array<Edge<T>>;
};

export type Edge<T> = {
    node: T;
};

export type Cart = {

    totalQuantity: number;
    lines: CartItem[];
    cost: {

        totalAmount: Money;

    };
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

export type Collection = ShopifyCollection & {
    path: string;
};

export type Image = {
    url: string;
    altText: string;
    width: number;
    height: number;
};

export type Menu = {
    title: string;
    path: string;
};

export type Money = {
    amount: string;
    currencyCode: string;
};


export type Product = Omit<ShopifyProduct, "variants" | "images"> & {
    variants: ProductVariant[];
    images: Image[];
};

export type ProductOption = {
    id: string;
    name: string;
    values: string[];
};

export type ProductVariant = {
    id: string;
    title: string;
    availableForSale: boolean;
    selectedOptions: {
        name: string;
        value: string;
    }[];
    price: Money;
};


export type ShopifyCollection = {
    handle: string;
    title: string;
    description: string;
    updatedAt: string;
};

export type ShopifyProduct = {
    id: string;
    handle: string;
    availableForSale: boolean;
    title: string;
    description: string;
    options: ProductOption[];
    priceRange: {
        maxVariantPrice: Money;
        minVariantPrice: Money;
    };
    variants: Connection<ProductVariant>;
    featuredImage: Image;
    images: Connection<Image>;
    tags: string[];
    updatedAt: string;
};



