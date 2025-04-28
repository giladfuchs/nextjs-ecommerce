"use client";


import {
    Grid, Container, Box
} from "@mui/material";

import CheckoutInfo from "./CheckoutInfo";
import CheckoutSummary from "./CheckoutSummary";


export default function CheckoutPage() {
    return (
        <Container maxWidth="lg" disableGutters sx={{ py: 4 }}>
            <Grid container spacing={4} justifyContent="center" alignItems="flex-start">

                {/* Checkout Info */}
                <Grid item xs={12} md={5}>
                    <CheckoutInfo />
                </Grid>

                {/* Checkout Summary */}
                <Grid item xs={12} md={5}>
                    <CheckoutSummary />
                </Grid>

            </Grid>
        </Container>

    );
}