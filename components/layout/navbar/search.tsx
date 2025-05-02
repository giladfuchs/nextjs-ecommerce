'use client';

import { useState, useEffect } from 'react';
import {
    useRouter,
    usePathname,
    useSearchParams,
} from 'next/navigation';
import {
    TextField,
    InputAdornment,
    Button,
    Box,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ModelType } from '../../../app/admin/form/form';

const adminRoutes = [
    { label: 'מוצרים', model: ModelType.product },
    { label: 'הזמנות', model: ModelType.order },
    { label: 'קטגוריות', model: ModelType.collection },
];

function AdminNav() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <Box display="flex" gap={2} flexDirection="row">
            {adminRoutes.map((item) => {
                const isActive = pathname === `/admin/${item.model}`;

                return (
                    <ListItemButton
                        key={item.model}
                        onClick={() => router.push(`/admin/${item.model}`)}
                        sx={{
                            borderRadius: '12px',
                            px: 3,
                            py: 0.5,
                            backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                            transition: 'background-color 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'var(--color-accent)',
                            },
                        }}
                    >
                        <ListItemText
                            primary={
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: isActive ? 'white' : 'black',
                                        fontWeight: isActive ? 'bold' : 'normal',
                                    }}
                                >
                                    {item.label}
                                </Typography>
                            }
                        />
                    </ListItemButton>
                );
            })}
        </Box>
    );
}

export default function Search() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);

    const isProductPage = pathname.startsWith('/product/');
    const isAdminPage = pathname.startsWith('/admin');

    useEffect(() => {
        if (isProductPage || isAdminPage) return;
        setQuery(searchParams.get('q') || '');
    }, [searchParams, pathname]);

    useEffect(() => {
        if (isProductPage || isAdminPage) return;

        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (query.trim()) {
                params.set('q', query.trim());
            } else {
                params.delete('q');
            }

            const queryString = params.toString();
            const newUrl = `${pathname}${queryString ? `?${queryString}` : ''}`;
            const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

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

    return isAdminPage ? (
        <AdminNav />
    ) : (
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
                            <SearchIcon className="text-gray-400" fontSize="small" />
                        </InputAdornment>
                    ),
                }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/admin')}
            >
                ניהול
            </Button>
        </Box>
    );
}