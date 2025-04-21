import { headers } from 'next/headers';
import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { mockProducts } from 'lib/shopify';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = (searchParams ?? {}) as { [key: string]: string };


  const headersList = await headers();
  const pathname = headersList.get('x-next-url') || '/';

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
  if (searchValue) {
    filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  const resultsText = filteredProducts.length === 1 ? 'result' : 'results';

  return (
      <>
        {searchValue ? (
            <p className="mb-4">
              {filteredProducts.length === 0
                  ? 'There are no products that match '
                  : `Showing ${filteredProducts.length} ${resultsText} for `}
              <span className="font-bold">&quot;{searchValue}&quot;</span>
            </p>
        ) : null}

        {filteredProducts.length > 0 ? (
            <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <ProductGridItems products={filteredProducts} />
            </Grid>
        ) : null}
      </>
  );
}
