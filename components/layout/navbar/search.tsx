'use client';

import {useState, useEffect} from "react";
import {useRouter, usePathname, useSearchParams} from "next/navigation";
import {TextField, InputAdornment, Button, Box} from "@mui/material";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";

export default function Search() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialQuery = searchParams.get("q") || "";
    const [query, setQuery] = useState(initialQuery);

    const isProductPage = pathname.startsWith("/product/");
    const isAdminPage = pathname.startsWith("/admin");

    useEffect(() => {
        if (isProductPage || isAdminPage) return;
        setQuery(searchParams.get("q") || "");
    }, [searchParams, pathname]);

    useEffect(() => {
        if (isProductPage || isAdminPage) return;

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

    if (isProductPage) return null;

    // 👉 Admin section buttons
    if (isAdminPage) {
        return (
            <Box display="flex" gap={2}>
                <Button variant="outlined" onClick={() => router.push('/admin/product')}>
                    מוצרים
                </Button>
                <Button variant="outlined" onClick={() => router.push('/admin/order')}>
                    הזמנות
                </Button>
            </Box>
        );
    }

    // 👉 Normal search bar with "Admin" button
    return (
        <Box display="flex" gap={2}>
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
            <Button variant="contained" color="primary" onClick={() => router.push('/admin')}>
                ניהול
            </Button>
        </Box>
    );
}
