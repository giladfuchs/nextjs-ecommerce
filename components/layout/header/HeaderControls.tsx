"use client";
import {useState, useEffect, useRef} from "react";
import {useRouter, usePathname, useSearchParams} from "next/navigation";
import {useIntl, FormattedMessage} from "react-intl";

import {toast} from "sonner";
import {
  TextField,
  InputAdornment,
  Button,
  Box,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {ModelType} from "../../../lib/types";

const adminRoutes: ModelType[] = [
  ModelType.order,
  ModelType.product,
  ModelType.category,
];

export function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Box display="flex" gap={2} flexDirection="row">
      {adminRoutes.map((model) => {
        const isActive = pathname === `/admin/${model}`;

        return (
          <ListItemButton
            key={model}
            onClick={() => router.push(`/admin/${model}`)}
            sx={{
              borderRadius: "12px",
              px: 3,
              py: 0.5,
              backgroundColor: isActive ? "var(--color-accent)" : "transparent",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: "var(--color-accent)",
              },
            }}
          >
            <ListItemText
              primary={
                <Typography
                  variant="body1"
                  sx={{
                    color: isActive ? "white" : "black",
                    fontWeight: isActive ? "bold" : "normal",
                  }}
                >
                  <FormattedMessage id={`admin.${model}.title`} />
                </Typography>
              }
            />
          </ListItemButton>
        );
      })}
    </Box>
  );
}

function Search() {
  const intl = useIntl();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const lastAppliedQuery = useRef<string>(query);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = query.trim();
      if (trimmed === lastAppliedQuery.current) return;

      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }

      const newUrl = `${pathname}${params.toString() ? `?${params}` : ""}`;
      lastAppliedQuery.current = trimmed;
      router.replace(newUrl);
    }, 500);

    return () => clearTimeout(timeout);
  }, [query, pathname, router, searchParams]);

  return (
    <TextField
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={intl.formatMessage({ id: "search.placeholder" })}
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
  );
}

function AuthButtons() {
  const intl = useIntl();
  const router = useRouter();
  const pathname = usePathname();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const expiresAt = Number(localStorage.getItem("token_expires_at"));
    const isExpired = Date.now() > expiresAt;

    if (isExpired) {
      localStorage.removeItem("token");
      localStorage.removeItem("token_expires_at");
      setHasToken(false);
      return;
    }

    const token = localStorage.getItem("token");
    setHasToken(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expires_at");
    toast.success(intl.formatMessage({ id: "logout.success" }));
    setHasToken(false);
    router.push("/");
  };

  if (!hasToken) return null;

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/admin")}
      >
        <FormattedMessage id="search.admin" />
      </Button>
      <Button variant="outlined" color="error" onClick={handleLogout}>
        <FormattedMessage id="search.logout" />
      </Button>
    </>
  );
}

export default function HeaderControls() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <AdminNav />;
  }

  if (
    pathname.startsWith("/product/") ||
    pathname.startsWith("/legal/") ||
    pathname.startsWith("/login")
  ) {
    return null;
  }

  return (
    <Box display="flex" gap={2}>
      <Search />
      <AuthButtons />
    </Box>
  );
}
