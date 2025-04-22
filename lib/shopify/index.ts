import {
    HIDDEN_PRODUCT_TAG,
    SHOPIFY_GRAPHQL_API_ENDPOINT,
    TAGS
} from 'lib/constants';
import {isShopifyError} from 'lib/type-guards';
import {ensureStartsWith} from 'lib/utils';

// import {cookies, headers} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';
import {
    addToCartMutation,
    createCartMutation,
    editCartItemsMutation,
    removeFromCartMutation
} from './mutations/cart';
import {getCartQuery} from './queries/cart';
import {
    getCollectionProductsQuery,
    getCollectionQuery,
    getCollectionsQuery
} from './queries/collection';
import {getMenuQuery} from './queries/menu';
import {getPageQuery, getPagesQuery} from './queries/page';
import {
    getProductQuery,
    getProductRecommendationsQuery,
    getProductsQuery
} from './queries/product';
import {
    Cart,
    Collection,
    Connection,
    Image,
    Menu,
    Page,
    Product,
    ShopifyAddToCartOperation,
    ShopifyCart,
    ShopifyCartOperation,
    ShopifyCollection,
    ShopifyCollectionOperation,
    ShopifyCollectionProductsOperation,
    ShopifyCollectionsOperation,
    ShopifyCreateCartOperation,
    ShopifyMenuOperation,
    ShopifyPageOperation,
    ShopifyPagesOperation,
    ShopifyProduct,
    ShopifyProductOperation,
    ShopifyProductRecommendationsOperation,
    ShopifyProductsOperation,
    ShopifyRemoveFromCartOperation,
    ShopifyUpdateCartOperation
} from './types';

const domain = process.env.SHOPIFY_STORE_DOMAIN
    ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
    : '';
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object }
    ? T['variables']
    : never;

export async function shopifyFetch<T>({
                                          headers,
                                          query,
                                          variables
                                      }: {
    headers?: HeadersInit;
    query: string;
    variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
    return Promise.resolve({status: 200, body: {} as T})
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
    return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
    if (!cart.cost?.totalTaxAmount) {
        cart.cost.totalTaxAmount = {
            amount: '0.0',
            currencyCode: cart.cost.totalAmount.currencyCode
        };
    }

    return {
        ...cart,
        lines: removeEdgesAndNodes(cart.lines)
    };
};

const reshapeCollection = (
    collection: ShopifyCollection
): Collection | undefined => {
    if (!collection) {
        return undefined;
    }

    return {
        ...collection,
        path: `/search/${collection.handle}`
    };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
    const reshapedCollections = [];

    for (const collection of collections) {
        if (collection) {
            const reshapedCollection = reshapeCollection(collection);

            if (reshapedCollection) {
                reshapedCollections.push(reshapedCollection);
            }
        }
    }

    return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
    const flattened = removeEdgesAndNodes(images);

    return flattened.map((image) => {
        const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
        return {
            ...image,
            altText: image.altText || `${productTitle} - ${filename}`
        };
    });
};

const reshapeProduct = (
    product: ShopifyProduct,
    filterHiddenProducts: boolean = true
) => {
    if (
        !product ||
        (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
    ) {
        return undefined;
    }

    const {images, variants, ...rest} = product;

    return {
        ...rest,
        images: reshapeImages(images, product.title),
        variants: removeEdgesAndNodes(variants)
    };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
    const reshapedProducts = [];

    for (const product of products) {
        if (product) {
            const reshapedProduct = reshapeProduct(product);

            if (reshapedProduct) {
                reshapedProducts.push(reshapedProduct);
            }
        }
    }

    return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
    const res = await shopifyFetch<ShopifyCreateCartOperation>({
        query: createCartMutation
    });

    return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
    lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
    const cartId = "2";
    const res = await shopifyFetch<ShopifyAddToCartOperation>({
        query: addToCartMutation,
        variables: {
            cartId,
            lines
        }
    });
    return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
    const cartId = "2";
    const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
        query: removeFromCartMutation,
        variables: {
            cartId,
            lineIds
        }
    });

    return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
    lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
    const cartId = "2"
    const res = await shopifyFetch<ShopifyUpdateCartOperation>({
        query: editCartItemsMutation,
        variables: {
            cartId,
            lines
        }
    });

    return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export const mockCart = {
    id: 'mock-cart-id',
    checkoutUrl: 'https://example.com/checkout',
    totalQuantity: 2,
    lines: [
        {
            id: 'line-1',
            quantity: 2,
            merchandise: {
                id: 'prod-1',
                title: 'Mock Shirt',
                selectedOptions: [
                    { name: 'Size', value: 'M' },
                    { name: 'Color', value: 'Blue' }
                ],
                product: {
                    id: 'product-1',
                    title: 'Mock Shirt',
                    handle: 'mock-shirt',
                    featuredImage: {
                        url: '/placeholder.jpg',
                        altText: 'Mock Shirt',
                        width: 800,
                        height: 800
                    }
                },
                image: {
                    url: '/placeholder.jpg',
                    altText: 'Mock Shirt'
                },
                price: {
                    amount: '29.99',
                    currencyCode: 'USD'
                }
            },
            cost: {
                totalAmount: {
                    amount: '59.98',
                    currencyCode: 'USD'
                }
            }
        }
    ],
    cost: {
        subtotalAmount: {
            amount: '59.98',
            currencyCode: 'USD'
        },
        totalAmount: {
            amount: '59.98',
            currencyCode: 'USD'
        },
        totalTaxAmount: {
            amount: '0.00',
            currencyCode: 'USD'
        }
    }
};





export const mockCollections = [
    {handle: 'all', title: 'All', description: '', seo: {}, updatedAt: '', path: '/'},
    {
        handle: 'apparel',
        title: 'Apparel',
        description: 'Browse our latest apparel.',
        seo: {},
        updatedAt: '',
        path: '/collection/apparel'
    },
    {
        handle: 'shoes',
        title: 'Shoes',
        description: 'Find stylish shoes for every occasion.',
        seo: {},
        updatedAt: '',
        path: '/collection/shoes'
    },
    {
        handle: 'accessories',
        title: 'Accessories',
        description: 'Complete your outfit with our accessories.',
        seo: {},
        updatedAt: '',
        path: '/collection/accessories'
    },
    {
        handle: 'electronics',
        title: 'Electronics',
        description: 'Explore gadgets and devices.',
        seo: {},
        updatedAt: '',
        path: '/collection/electronics'
    },
    {
        handle: 'home',
        title: 'Home',
        description: 'Essentials and decor for your home.',
        seo: {},
        updatedAt: '',
        path: '/collection/home'
    },
    {
        handle: 'outdoors',
        title: 'Outdoors',
        description: 'Gear up for your next adventure.',
        seo: {},
        updatedAt: '',
        path: '/collection/outdoors'
    },
    {
        handle: 'beauty',
        title: 'Beauty',
        description: 'Enhance your routine with our beauty picks.',
        seo: {},
        updatedAt: '',
        path: '/collection/beauty'
    },
    {
        handle: 'books',
        title: 'Books',
        description: 'Discover your next favorite read.',
        seo: {},
        updatedAt: '',
        path: '/collection/books'
    }
];

export async function getCollections(): Promise<Collection[]> {
    return Promise.resolve(mockCollections);
}

export async function getCart(): Promise<Cart | undefined> {
    return Promise.resolve(mockCart) as Promise<Cart>;

}

export async function getCollection(handle: string) {
    return mockCollections.find((collection) => collection.handle === handle);
}

export async function getCollectionProducts({
                                                collection,
                                                reverse,
                                                sortKey
                                            }: {
    collection: string;
    reverse?: boolean;
    sortKey?: string;
}): Promise<Product[]> {

    return Promise.resolve(mockProducts.filter(
        (product) => product.collection === collection
    ))
}


export async function getMenu(handle: string): Promise<Menu[]> {


    const res = await shopifyFetch<ShopifyMenuOperation>({
        query: getMenuQuery,
        variables: {
            handle
        }
    });

    return (
        res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
            title: item.title,
            path: item.url
                .replace(domain, '')
                .replace('/pages', '')
        })) || []
    );
}

export async function getPage(handle: string): Promise<Page> {
    const res = await shopifyFetch<ShopifyPageOperation>({
        query: getPageQuery,
        variables: {handle}
    });

    return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
    const res = await shopifyFetch<ShopifyPagesOperation>({
        query: getPagesQuery
    });

    return removeEdgesAndNodes(res.body.data.pages);
}

import mockProductsJson from './mock_products.json'

export const mockProducts = mockProductsJson


export async function getMockProduct(handle: string) {
    return mockProducts.find((p) => p.handle === handle);
}

// export async function getMockProduct({ handle }: { handle: string }) {
//     return mockProducts.find((p) => p.handle === handle);
// }
export async function getProduct(handle: string): Promise<Product | undefined> {


    const res = await shopifyFetch<ShopifyProductOperation>({
        query: getProductQuery,
        variables: {
            handle
        }
    });

    return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(
    productId: string
): Promise<Product[]> {
    return Promise.resolve([])
    // cacheTag(TAGS.products);
    // cacheLife('days');
    //
    // const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    //     query: getProductRecommendationsQuery,
    //     variables: {
    //         productId
    //     }
    // });
    //
    // return reshapeProducts(res.body.data.productRecommendations);
}

export async function getProducts({
                                      query,
                                      reverse,
                                      sortKey
                                  }: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
}): Promise<Product[]> {


    const res = await shopifyFetch<ShopifyProductsOperation>({
        query: getProductsQuery,
        variables: {
            query,
            reverse,
            sortKey
        }
    });

    return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
    // We always need to respond with a 200 status code to Shopify,
    // otherwise it will continue to retry the request.
    const collectionWebhooks = [
        'collections/create',
        'collections/delete',
        'collections/update'
    ];
    const productWebhooks = [
        'products/create',
        'products/delete',
        'products/update'
    ];
    const topic = 'unknown';
    const secret = req.nextUrl.searchParams.get('secret');
    const isCollectionUpdate = collectionWebhooks.includes(topic);
    const isProductUpdate = productWebhooks.includes(topic);

    if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
        console.error('Invalid revalidation secret.');
        return NextResponse.json({status: 401});
    }

    if (!isCollectionUpdate && !isProductUpdate) {
        // We don't need to revalidate anything for any other topics.
        return NextResponse.json({status: 200});
    }

    return NextResponse.json({status: 200, revalidated: true, now: Date.now()});
}
