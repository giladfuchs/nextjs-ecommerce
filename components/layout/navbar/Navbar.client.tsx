'use client';

import Link from "next/link";
import Search from "./search";
import CartModal from "components/cart/modal";
import LogoSquare from "components/logo-square";

export default function NavbarClient( ) {
    return (
        <nav className="relative flex flex-col items-center p-4 lg:px-6">
            <div className="flex w-full items-center justify-between">
                {/* Logo */}
                <Link href="/" prefetch={true} className="flex items-center">
                    <LogoSquare />

                </Link>

                {/* Search */}
                <div className="flex w-full md:w-1/3 justify-center px-2">
                    <Search />
                </div>

                {/* Cart */}
                <div className="flex justify-end w-auto md:w-1/3">
                    <CartModal />
                </div>
            </div>
        </nav>
    );
}
