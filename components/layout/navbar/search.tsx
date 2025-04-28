'use client';

import {useState, useEffect} from "react";
import {useRouter, usePathname, useSearchParams} from "next/navigation";
import {TextField, InputAdornment} from "@mui/material"; // 🛠 no Skeleton needed now
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";

export default function Search() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialQuery = searchParams.get("q") || "";
    const [query, setQuery] = useState(initialQuery);

    const isProductPage = pathname.startsWith("/product/");

    useEffect(() => {
        if (isProductPage) return;
        setQuery(searchParams.get("q") || "");
    }, [searchParams, pathname]);

    useEffect(() => {
        if (isProductPage) return;

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
        }, 500);

        return () => clearTimeout(timeout);
    }, [query, pathname, router, searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    if (isProductPage) {
        return null;
    }

    return (
        <TextField
            value={query}
            onChange={handleChange}
            placeholder="חיפוש מוצרים"
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400"/>
                    </InputAdornment>
                ),

            }}
        />

    );
}
