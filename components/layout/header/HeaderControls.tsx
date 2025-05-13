"use client";
import {useState, useEffect, useRef} from "react";
import {useRouter, usePathname, useSearchParams} from "next/navigation";
import {useIntl, FormattedMessage} from "react-intl";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import {toast} from "sonner";
import {
    TextField,
    InputAdornment,

    Box,
    ListItemButton,
    ListItemText,
    Typography, Tooltip, IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import Cart from "components/cart/Cart";
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
                                    <FormattedMessage id={`admin.${model}.title`}/>
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
            placeholder={intl.formatMessage({id: "search.placeholder"})}
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchIcon className="text-gray-400" fontSize="small"/>
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
        toast.success(intl.formatMessage({id: "logout.success"}));
        setHasToken(false);
        router.push("/");
    };

    if (!hasToken) return null;

    return (
        <>
            <Tooltip title={<FormattedMessage id="search.admin" />}>
                <IconButton
                    color="primary"
                    onClick={() => router.push("/admin")}
                    size="large"
                >
                    <AdminPanelSettingsIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title={<FormattedMessage id="search.logout" />}>
                <IconButton
                    color="error"
                    onClick={handleLogout}
                    size="large"
                >
                    <LogoutIcon />
                </IconButton>
            </Tooltip>
        </>
    );
}


export default function HeaderControls() {
    const pathname = usePathname();

    const isAdmin = pathname.startsWith("/admin");

    if (isAdmin) {
        return (
            <>
            <div className="flex w-full md:w-1/3 justify-center px-2">
                <AdminNav/>
            </div>
        <div className="flex justify-end w-auto md:w-1/3">
        </div></>
        );
    }

    const shouldHideSearch =
        pathname.startsWith("/product/") ||
        pathname.startsWith("/legal/") ||
        pathname.startsWith("/login");

    return (


        <>
            <div className="flex w-full md:w-1/3 justify-center px-2">
                <Box display="flex" gap={2}>
                    {!shouldHideSearch && <Search/>}
                    <AuthButtons/>
                </Box>
            </div>
            <div className="flex justify-end w-auto md:w-1/3">
                <Cart/>
            </div>
        </>
    );
}