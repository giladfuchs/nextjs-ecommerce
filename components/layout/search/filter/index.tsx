"use client";

import {
  Autocomplete,
  TextField,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Collection } from "../../../../lib/types";

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// Desktop list
function FilterItemList({ list }: { list: Collection[] }) {
  const router = useRouter();
  const pathname = safeDecodeURIComponent(usePathname());

  return (
    <>
      {list.map((item: Collection, index: number) => {
        const isActive = pathname.endsWith(`/collection/${item.handle}`);

        return (
          <ListItemButton
            key={index}
            onClick={() =>
              router.push(
                item.handle === "הכל" ? "/" : `/collection/${item.handle}`,
              )
            }
            sx={{
              borderRadius: "8px",
              mb: 0.5,
              py: 1,
              px: 2,
              textAlign: "right",
              backgroundColor: isActive ? "#e0f7fa" : "transparent",
              "&:hover": {
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

// Main
export default function FilterList({ list }: { list: Collection[] }) {
  const router = useRouter();
  const pathname = safeDecodeURIComponent(usePathname());

  const initialItem =
    list.find((item) => pathname.endsWith(`/collection/${item.handle}`)) ||
    undefined;

  const [selectedItem, setSelectedItem] = useState<Collection | undefined>(
    initialItem,
  );

  useEffect(() => {
    const matching =
      list.find((item) => pathname.endsWith(`/collection/${item.handle}`)) ||
      undefined;
    setSelectedItem(matching);
  }, [pathname, list]);
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
          value={selectedItem}
          onChange={(event, value) => {
            if (value?.handle) {
              router.push(
                value.handle === "הכל" ? "/" : `/collection/${value.handle}`,
              );
            }
            setSelectedItem(value || undefined);
          }}
          isOptionEqualToValue={(option, value) =>
            option.handle === value?.handle
          }
          disableClearable
          renderInput={renderAutocompleteInput}
        />
      </div>
    </nav>
  );
}
