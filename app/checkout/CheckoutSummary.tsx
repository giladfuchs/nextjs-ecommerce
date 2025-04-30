import { Box, Divider, Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Price from '../../components/price';
import React from 'react';

export default function CheckoutSummary() {
    const cart = useSelector((state: RootState) => state.cart);

    return (
        <Box
            sx={{
                width: '100%',
                mx: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography variant="h4" textAlign="center" fontWeight="bold" mb={2}>
                סיכום הזמנה
            </Typography>

            {cart?.lines.length ? (
                cart.lines.map((product) => (
                    <Grid
                        key={product.productId}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            bgcolor: 'var(--color-bg)',
                            borderRadius: 2,
                            p: 2,
                            gap: 2,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                            direction: 'rtl',
                        }}
                    >
                        {/* Image */}
                        <Box
                            component="img"
                            src={product.imageUrl}
                            alt={product.imageAlt}
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 2,
                                objectFit: 'cover',
                                flexShrink: 0,
                            }}
                        />

                        {/* Text block */}
                        <Grid
                            item
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                                minWidth: 0,
                            }}
                        >
                            <Typography variant="subtitle1" textAlign="right">
                                {product.title}
                            </Typography>

                            <Typography variant="body2" textAlign="right">
                                <Price amount={product.unitAmount} />
                            </Typography>
                        </Grid>

                        <Divider sx={{ display: { xs: 'none', md: 'block' }, my: 1 }} />

                        <Grid
                            sx={{
                                mt: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                                minWidth: 0,
                            }}
                        >
                            <Typography
                                fontWeight="bold"
                                fontSize="1.2rem"
                                textAlign="right"
                                minWidth={70}
                            >
                                <Price amount={product.totalAmount} />
                            </Typography>
                            <Typography
                                variant="body2"
                                color="var(--color-text)"
                                textAlign="right"
                            >
                                כמות: {product.quantity}
                            </Typography>
                        </Grid>
                    </Grid>
                ))
            ) : (
                <Typography textAlign="center" color="text.secondary">
                    העגלה שלך ריקה
                </Typography>
            )}

            <Divider />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    direction: 'rtl',
                }}
            >
                <Typography variant="h6" fontWeight="bold">
                    סה"כ
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                    <Price amount={cart?.cost} />
                </Typography>
            </Box>
        </Box>
    );
}
