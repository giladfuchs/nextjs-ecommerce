import { headers } from 'next/headers';
import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { mockProducts } from 'lib/shopify';
function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
export default async function CollectionPage() {
  const headersList = await headers();
  const pathname = safeDecodeURIComponent( headersList.get('x-next-url') || '/');
  // Extract collection handle from path (e.g., /collection/shoes)
  const collectionMatch = pathname.match(/^\/collection\/([^/]+)$/);
  const collectionHandle = collectionMatch ? collectionMatch[1] : null;

  // Filter products by collection if handle is present
  let filteredProducts = mockProducts;

  if (collectionHandle && collectionHandle !== 'all') {
    filteredProducts = mockProducts.filter(
        (product) => product.collection === collectionHandle
    );
  }

  const resultsText = filteredProducts.length === 1 ? 'result' : 'results';

  return (
      <>
        <p className="mb-4">
          Showing {filteredProducts.length} {resultsText}
          {collectionHandle ? ` in "${collectionHandle}"` : null}
        </p>

        {filteredProducts.length > 0 ? (
            <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <ProductGridItems products={filteredProducts} />
            </Grid>
        ) : (
            <p>No products found.</p>
        )}
      </>
  );
}
