"use client";

import { Grid, Container } from "@mui/material";
import CheckoutInfo from "./CheckoutInfo";
import CheckoutSummary from "./CheckoutSummary";

export default function CheckoutPage() {
    return (
        <Container
            maxWidth="lg"
            disableGutters
            sx={{
                py: 4,
            }}
        >
            <Grid
                container
                spacing={4}
                justifyContent="center"
                alignItems="flex-start"
                sx={{
                    minHeight: '100vh',
                }}
            >
                <Grid
                    item
                    xs={12}
                    md={7}
                    sx={{
                        order: { xs: 1, md: 2 }
                    }}
                >
                    <CheckoutSummary />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={5}
                    sx={{
                        order: { xs: 2, md: 1 }
                    }}
                >
                    <CheckoutInfo />
                </Grid>
            </Grid>
        </Container>
    );
}
