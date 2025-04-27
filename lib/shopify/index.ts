

import {
  Collection,
  Product,

} from "./types";




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
import {NextRequest, NextResponse} from "next/server";

export const mockProducts = mockProductsJson;




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
