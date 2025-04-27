"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Search() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialQuery = searchParams.get("q") || "";
    const [query, setQuery] = useState(initialQuery);

    useEffect(() => {
        setQuery(searchParams.get("q") || "");
    }, [searchParams]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (query.trim()) {
                params.set("q", query.trim());
            } else {
                params.delete("q");
            }

            const queryString = params.toString();
            const newUrl = `${pathname}${queryString ? `?${queryString}` : ""}`;
            const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

            if (newUrl !== currentUrl) {
                router.replace(newUrl);
            }
        }, 500); // 500ms delay (debounce)

        return () => clearTimeout(timeout);
    }, [query, pathname, router, searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    return (
        <div className="relative w-full lg:w-80 xl:w-full">
            <input
                type="text"
                placeholder="חיפוש מוצרים"
                autoComplete="off"
                value={query}
                onChange={handleChange}
                className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500"
            />
            <div className="absolute left-0 top-0 ml-3 flex h-full items-center">
                <MagnifyingGlassIcon className="h-4" />
            </div>
        </div>
    );
}

export function SearchSkeleton() {
    return (
        <div className="relative w-full lg:w-80 xl:w-full">
            <input
                disabled
                placeholder="Loading search..."
                className="w-full rounded-lg border bg-neutral-200 px-4 py-2 text-sm text-neutral-500 placeholder:text-neutral-500 md:text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:placeholder:text-neutral-400 animate-pulse"
            />
            <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
                <MagnifyingGlassIcon className="h-4" />
            </div>
        </div>
    );
}
