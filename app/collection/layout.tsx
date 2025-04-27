import Collections from "components/layout/search/collections";
import ChildrenWrapper from "./children-wrapper";
import {Suspense} from "react";
import Search, {SearchSkeleton} from "../../components/layout/navbar/search";

export default function SearchLayout({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={null}>
            <div
                className="mx-auto flex max-w-(--breakpoint-2xl) flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white">

                {/* Sidebar - Collections + Mobile Search */}
                <div className="order-first w-full flex-none md:max-w-[125px]">
                    {/* Collections */}
                    <Collections/>

                    {/* Search under Collections - ONLY MOBILE */}
                    <div className="mt-4 w-full md:hidden">
                        <Suspense fallback={<SearchSkeleton/>}>
                            <Search/>
                        </Suspense>
                    </div>
                </div>

                {/* Main content */}
                <div className="order-last min-h-screen w-full md:order-none">
                    <ChildrenWrapper>{children}</ChildrenWrapper>
                </div>

            </div>
        </Suspense>
    );
}
