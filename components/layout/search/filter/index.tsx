'use client';

import { Autocomplete, TextField, ListItemButton, ListItemText, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export type ListItem = PathFilterItem;
export type PathFilterItem = { title: string; path: string };
function safeDecodeURIComponent(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

// Desktop list
function FilterItemList({ list }: { list: ListItem[] }) {
    const router = useRouter();
    const pathname = safeDecodeURIComponent(usePathname());
    return (
        <>
            {list.map((item: ListItem, index: number) => {
                const isActive = pathname === item.path; // Exact match

                return (
                    <ListItemButton
                        key={index}
                        onClick={() => router.push(item.path)}
                        sx={{
                            borderRadius: "8px",
                            mb: 0.5,
                            py: 1,
                            px: 2,
                            textAlign: "right",
                            backgroundColor: isActive ? "#e0f7fa" : "transparent",
                            '&:hover': {
                                backgroundColor: "#e0f7fa",
                            },
                        }}
                    >
                        <ListItemText
                            primary={
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: "black",
                                        fontWeight: isActive ? "bold" : "normal",
                                    }}
                                >
                                    {item.title}
                                </Typography>
                            }
                        />
                    </ListItemButton>
                );
            })}
        </>
    );
}

// Mobile input
function renderAutocompleteInput(params: any) {
    return (
        <TextField
            {...params}
            label="בחר קטגוריה"
            InputProps={{
                ...params.InputProps,
                style: { direction: "rtl" },
            }}
            InputLabelProps={{
                ...params.InputLabelProps,
                style: { direction: "rtl", textAlign: "right" },
            }}
        />
    );
}

// Main component
export default function FilterList({ list }: { list: ListItem[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const defaultItem = list.find((item) => pathname === item.path) || list.find((item) => item.title === "הכל") || undefined;


    return (
        <nav>
            {/* Desktop */}
            <div className="hidden md:block p-2">
                <FilterItemList list={list} />
            </div>

            {/* Mobile */}
            <div className="md:hidden p-2">
                <Autocomplete
                    options={list}
                    getOptionLabel={(option) => option.title}
                    defaultValue={defaultItem}
                    onChange={(event, value) => {
                        if (value?.path) {
                            router.push(value.path);
                        }
                    }}
                    isOptionEqualToValue={(option, value) => option.path === value.path}
                    disableClearable
                    renderInput={renderAutocompleteInput}
                />
            </div>
        </nav>
    );
}
