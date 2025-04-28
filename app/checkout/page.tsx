// @ts-ignore

"use client";

import { useSelector } from "react-redux";
import { RootState } from "../../store";

import {
    Typography,
    Divider,
    Box,
    Avatar,
    Container,Grid
} from "@mui/material";

import Info from "./Info";

function CheckoutSummary() {
    const cart = useSelector((state: RootState) => state.cart);

    return (
        <Box
            sx={{
                bgcolor: "var(--color-bg-dark)",
                color: "var(--color-text-strong)",
                borderRadius: 3,
                p: 4,
                minHeight: "100%"
            }}
        >
            <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="right">
                סיכום הזמנה
            </Typography>

            {cart?.lines.length ? (
                <Box>
                    {cart.lines.map((product) => (
                        <Grid
                            container
                            spacing={2}
                            key={product.id}
                            alignItems="center"
                            mb={2}
                            sx={{ direction: "rtl" }}
                        >
                            {/* Price */}
                            <Grid item xs={3}>
                                <Typography fontWeight="bold">
                                    {product.cost.totalAmount.amount} {product.cost.totalAmount.currencyCode}
                                </Typography>
                            </Grid>

                            {/* Title + Quantity */}
                            <Grid item  xs={6}>
                                <Typography fontWeight="medium" fontSize="0.9rem" noWrap>
                                    {product.merchandise.product.title}
                                </Typography>
                                <Typography variant="body2" color="var(--color-text)">
                                    כמות {product.quantity}
                                </Typography>
                            </Grid>

                            {/* Image */}
                            <Grid item  xs={3}>
                                <Avatar
                                    variant="rounded"
                                    src={product.merchandise.product.featuredImage.url}
                                    alt={product.merchandise.product.title}
                                    sx={{ width: 56, height: 56 }}
                                />
                            </Grid>
                        </Grid>
                    ))}
                </Box>
            ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                    העגלה שלך ריקה
                </Typography>
            )}

            <Divider sx={{ my: 2, bgcolor: "var(--color-border)" }} />

            <Grid container justifyContent="space-between" sx={{ direction: "rtl" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                    סה\"כ
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                    {cart?.cost.totalAmount.amount} {cart?.cost.totalAmount.currencyCode}
                </Typography>
            </Grid>
        </Box>
    );
}

export default function CheckoutPage() {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* Order Summary */}
                <Grid item xs={12} md={9}>
                    <CheckoutSummary />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Info />
                </Grid>
            </Grid>
        </Container>
    );
}
