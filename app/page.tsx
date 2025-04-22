
import SearchPage from "./collection/page";
import SearchLayout from "./collection/layout";
import CollectionPage from "./collection/page";
// import {useStore} from "../lib/store";

export const metadata = {
    description:
        'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
    openGraph: {
        type: 'website'
    }
};

export default async function HomePage() {
    // const {fetchData} = useStore();
    //
    // fetchData();

    return (

        <SearchLayout>
            <CollectionPage/>
        </SearchLayout>
    );
}
