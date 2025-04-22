import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS,
} from "lib/constants";
import { isShopifyError } from "lib/type-guards";
import { ensureStartsWith } from "lib/utils";

import { NextRequest, NextResponse } from "next/server";
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
} from "./mutations/cart";

import {
  Cart,
  Collection,
  Connection,
  Image,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCollection,
  ShopifyCreateCartOperation,
  ShopifyProduct,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
} from "./types";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export async function shopifyFetch<T>({
  headers,
  query,
  variables,
}: {
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  return Promise.resolve({ status: 200, body: {} as T });
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: "0.0",
      currencyCode: cart.cost.totalAmount.currencyCode,
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines),
  };
};

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cartId = "2";
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines,
    },
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = "2";
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds,
    },
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cartId = "2";
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines,
    },
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export const mockCart = {
  id: "mock-cart-id",
  checkoutUrl: "https://example.com/checkout",
  totalQuantity: 2,
  lines: [
    {
      id: "line-1",
      quantity: 2,
      merchandise: {
        id: "prod-1",
        title: "Mock Shirt",
        selectedOptions: [
          { name: "Size", value: "M" },
          { name: "Color", value: "Blue" },
        ],
        product: {
          id: "product-1",
          title: "Mock Shirt",
          handle: "mock-shirt",
          featuredImage: {
            url: "/placeholder.jpg",
            altText: "Mock Shirt",
            width: 800,
            height: 800,
          },
        },
        image: {
          url: "/placeholder.jpg",
          altText: "Mock Shirt",
        },
        price: {
          amount: "29.99",
          currencyCode: "USD",
        },
      },
      cost: {
        totalAmount: {
          amount: "59.98",
          currencyCode: "USD",
        },
      },
    },
  ],
  cost: {
    subtotalAmount: {
      amount: "59.98",
      currencyCode: "USD",
    },
    totalAmount: {
      amount: "59.98",
      currencyCode: "USD",
    },
    totalTaxAmount: {
      amount: "0.00",
      currencyCode: "USD",
    },
  },
};

export const mockCollections = [
  {
    handle: "הכל",
    title: "הכל",
    description: "",
    seo: {},
    updatedAt: "",
    path: "/",
  },
  {
    handle: "צמחי-בית",
    title: "צמחי בית",
    description: "מגוון צמחי נוי לבית ולמשרד.",
    seo: {},
    updatedAt: "",
    path: "/collection/צמחי-בית",
  },
  {
    handle: "עשבי-תיבול",
    title: "עשבי תיבול",
    description: "גידול עצמי של בזיליקום, נענע, פטרוזיליה ועוד.",
    seo: {},
    updatedAt: "",
    path: "/collection/עשבי-תיבול",
  },
  {
    handle: "עציצים-ואדניות",
    title: "עציצים ואדניות",
    description: "שלל עציצים, אדניות ועציצי תלייה מעוצבים.",
    seo: {},
    updatedAt: "",
    path: "/collection/עציצים-ואדניות",
  },
  {
    handle: "כלי-גינון",
    title: "כלי גינון",
    description: "הכלים שצריך לגידול וטיפוח הגינה שלך.",
    seo: {},
    updatedAt: "",
    path: "/collection/כלי-גינון",
  },
  {
    handle: "דשנים-ואדמה",
    title: "דשנים ואדמה",
    description: "אדמה איכותית, דשן אורגני ותערובות שתילה.",
    seo: {},
    updatedAt: "",
    path: "/collection/דשנים-ואדמה",
  },
  {
    handle: "עיצוב-הגינה",
    title: "עיצוב הגינה",
    description: "קישוטים, אורות ופריטים ייחודיים לגינה שלך.",
    seo: {},
    updatedAt: "",
    path: "/collection/עיצוב-הגינה",
  },
  {
    handle: "צמחי-חוץ",
    title: "צמחי חוץ",
    description: "צמחים עמידים המתאימים לאקלים הישראלי.",
    seo: {},
    updatedAt: "",
    path: "/collection/צמחי-חוץ",
  },
  {
    handle: "מתנות",
    title: "מתנות",
    description: "מתנות ירוקות לכל מי שאוהב צמחים.",
    seo: {},
    updatedAt: "",
    path: "/collection/מתנות",
  },
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
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  return Promise.resolve(
    mockProducts.filter((product) => product.collection === collection),
  );
}

import mockProductsJson from "./mock_products.json";

export const mockProducts = mockProductsJson;

export async function getMockProduct(handle: string) {
  return mockProducts.find((p) => p.handle === handle);
}

// export async function getMockProduct({ handle }: { handle: string }) {
//     return mockProducts.find((p) => p.handle === handle);
// }

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  return Promise.resolve([]);
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
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  return Promise.resolve(mockProducts);
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = [
    "collections/create",
    "collections/delete",
    "collections/update",
  ];
  const productWebhooks = [
    "products/create",
    "products/delete",
    "products/update",
  ];
  const topic = "unknown";
  const secret = req.nextUrl.searchParams.get("secret");
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error("Invalid revalidation secret.");
    return NextResponse.json({ status: 401 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
