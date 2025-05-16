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
import { useIntl, FormattedMessage } from "react-intl";
import { Category, ModelType } from "../../../lib/types";

import {safeDecodeURIComponent} from "lib/helper";


// Desktop list
function CategoriesItemList({ list }: { list: Category[] }) {
  const router = useRouter();
  const pathname = safeDecodeURIComponent(usePathname());

  return (
    <>
      {list.map((item: Category, index: number) => {
        const isAll = item.handle === "all";
        const isActive =
          pathname.endsWith(`/${ModelType.category}/${item.handle}`) ||
          (isAll && pathname === "/");

        return (
          <ListItemButton
            key={index}
            data-testid="category-link"
            onClick={() =>
              router.push(isAll ? "/" : `/${ModelType.category}/${item.handle}`)
            }
            sx={{
              borderRadius: "8px",
              mb: 0.5,
              py: 1,
              px: 2,
              textAlign: "right",
              backgroundColor: isActive
                ? "var(--category-active-bg, #e0f7fa)"
                : "transparent",
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: "var(--category-hover-bg, #e0f7fa)",
              },
            }}
          >
            <ListItemText
              primary={
                <Typography
                  component="span"
                  className="category-title"
                  sx={{
                    fontSize: "1.1em",
                    fontWeight: isActive ? "bold" : "normal",
                    color: "black",
                    textDecoration: "inherit",
                  }}
                >
                  {isAll ? (
                    <FormattedMessage id={`${ModelType.category}.all`} />
                  ) : (
                    item.title
                  )}
                </Typography>
              }
            />
          </ListItemButton>
        );
      })}
    </>
  );
}

export default function Categories({ list }: { list: Category[] }) {
  const router = useRouter();
  const pathname = safeDecodeURIComponent(usePathname());
  const intl = useIntl();

  const all_option = {
    handle: "all",
    title: intl.formatMessage({ id: `${ModelType.category}.all` }),
  } as Category;

  const options = [all_option, ...list];

  const initialItem =
    list.find((item) =>
      pathname.endsWith(`/${ModelType.category}/${item.handle}`),
    ) ?? (pathname === "/" ? options[0] : undefined);

  const [selectedItem, setSelectedItem] = useState<Category | undefined>(
    initialItem,
  );

  useEffect(() => {
    const matching =
      list.find((item) =>
        pathname.endsWith(`/${ModelType.category}/${item.handle}`),
      ) ?? (pathname === "/" ? options[0] : undefined);
    setSelectedItem(matching);
  }, [pathname, list]);

  return (
    <nav>
      {/* Desktop */}
      <div className="hidden md:block p-2">
        <CategoriesItemList list={options} />
      </div>

      {/* Mobile */}
      <div className="md:hidden p-2">
        <Autocomplete
          options={options}
          getOptionLabel={(option) => option.title}
          value={selectedItem}
          onChange={(event, value) => {
            const selected: Category = value ?? all_option;
            setSelectedItem(selected);
            router.push(
              selected.handle === "all"
                ? "/"
                : `/${ModelType.category}/${selected.handle}`,
            );
          }}
          isOptionEqualToValue={(option, value) =>
            option.handle === value?.handle
          }
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              label={intl.formatMessage({
                id: `${ModelType.category}.selectCategory`,
              })}
              InputProps={{
                ...params.InputProps,
                style: {
                  direction: "rtl",
                  fontSize: "1.1em",
                  textDecoration: "inherit",
                },
              }}
              InputLabelProps={{
                ...params.InputLabelProps,
                style: {
                  direction: "rtl",
                  textAlign: "right",
                },
              }}
            />
          )}
          renderOption={(props, option) => {
            const { key, ...rest } = props;
            return (
              <li key={option.handle} {...rest} dir="rtl">
                <span
                  style={{
                    fontSize: "1.1em",
                    textDecoration: "inherit",
                  }}
                >
                  {option.title}
                </span>
              </li>
            );
          }}
        />
      </div>
    </nav>
  );
}
