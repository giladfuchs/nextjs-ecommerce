"use client";

import Link from "next/link";
import { Menu } from "lib/types";
import Search, { SearchSkeleton } from "./search";
import CartModal from "components/cart/modal";
import LogoSquare from "components/logo-square";
import { Suspense } from "react";

const { SITE_NAME } = process.env;

export default function NavbarClient({ menu }: { menu: Menu[] }) {
    return (
        <nav className="relative flex flex-col items-center p-4 lg:px-6">
            <div className="flex w-full items-center justify-between">
                <Link href="/" prefetch={true} className="flex items-center">
                    <LogoSquare />
                    <div className="ml-2 text-sm font-medium uppercase">
                        {SITE_NAME}
                    </div>
                </Link>

                {/* ✅ Desktop Search only */}
                <div className="hidden md:flex w-1/3 justify-center">
                    <Suspense fallback={<SearchSkeleton />}>
                        <Search />
                    </Suspense>
                </div>

                <div className="flex justify-end md:w-1/3">
                    <CartModal />
                </div>
            </div>
        </nav>
    );
}
