import { Suspense } from "react";
import SearchLayout from "./collection/layout";
import CollectionPage from "./collection/page";

export const metadata = {
  description:
    "חנות שתילים של יערה",
  openGraph: {
    type: "website",
  },
};

export default async function HomePage() {
  return (
    <SearchLayout>
      <Suspense fallback={null}>
        <CollectionPage />
      </Suspense>
    </SearchLayout>
  );
}
