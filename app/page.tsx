import {Suspense} from "react";
import SearchLayout from "./collection/layout";
import CollectionPage from "./collection/page";
import {baseUrl} from "../lib/utils";

export const metadata = {
    title: 'יערה - הבית של הצמחים',
    description: 'צמחים ביתיים, מתנות ירוקות ומוצרים ייחודיים באהבה.',
    openGraph: {
        title: 'יערה - הבית של הצמחים',
        description: 'צמחים ביתיים, מתנות ירוקות ומוצרים ייחודיים באהבה.',
        images: ['https://scontent.ftlv6-1.fna.fbcdn.net/v/t39.30808-1/366316342_594394206200903_864814361091134817_n.png?stp=dst-png_s480x480&_nc_cat=103&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=mxpdzxGXF2QQ7kNvwEDiinH&_nc_oc=AdncL-ob6VBUU90XJb183Qi2ViCNBLQ1x1rgNtgutNz53YcGzsDqB5MvqiqN1FqBq48&_nc_zt=24&_nc_ht=scontent.ftlv6-1.fna&_nc_gid=LmVmTwziCIs1MWu_bn3G3w&oh=00_AfGs8tmANM3zIGq9G46NOS8aGeElrnu6BXGX1zWJmikqhA&oe=681A7206'],
        url: baseUrl,
        type: "website",

    }

};

export default async function HomePage() {
    return (
        <SearchLayout>
            <Suspense fallback={null}>
                <CollectionPage/>
            </Suspense>
        </SearchLayout>
    );
}
