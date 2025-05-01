"use client";

import {Grid, Container, Typography} from "@mui/material";
import CheckoutInfo from "./CheckoutInfo";
import CheckoutSummary from "./CheckoutSummary";
import {useState} from "react";

export default function CheckoutPage() {
    const [orderSuccess, setOrderSuccess] = useState<number | null>(null);
    const [orderError, setOrderError] = useState(false);

    return (
        <Container maxWidth="lg" disableGutters sx={{py: 4}}>
            {orderSuccess ? (

                <>
                    <Typography
                        variant="h5"
                        textAlign="center"
                        fontWeight="bold"
                        color="success.main"
                        mb={1}
                    >
                        ההזמנה בוצעה בהצלחה!
                    </Typography>
                    <Typography
                        variant="h6"
                        textAlign="center"
                        fontWeight="bold"
                        color="success.main"
                    >
                        מספר הזמנה: {orderSuccess}
                    </Typography>
                </>

            ) : (
                <Grid
                    container
                    spacing={4}
                    justifyContent="center"
                    alignItems="flex-start"
                    sx={{minHeight: "100vh"}}
                >
                    <Grid item xs={12} md={7} sx={{order: {xs: 1, md: 2}}}>
                        <CheckoutSummary/>
                    </Grid>
                    <Grid item xs={12} md={5} sx={{order: {xs: 2, md: 1}}}>
                        {orderError && (
                            <Typography
                                variant="h6"
                                textAlign="center"
                                fontWeight="bold"
                                color="error"
                                sx={{py: 4}}
                            >
                                ארעה שגיאה בעת השליחה. אנא נסה שוב.
                            </Typography>
                        )}
                        <CheckoutInfo
                            onSuccess={(id) => setOrderSuccess(id)}
                            onError={() => setOrderError(true)}
                        />
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}
