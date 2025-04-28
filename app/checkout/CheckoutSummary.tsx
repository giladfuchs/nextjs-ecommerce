
// @ts-ignore

import {useSelector} from "react-redux";
import {RootState} from "../../store";
import MainCard from "./MainCard";
import {Avatar, Divider, Grid, Typography} from "@mui/material";
import Price from "../../components/price";

export default function CheckoutSummary() {
    const cart = useSelector((state: RootState) => state.cart);

    return (

        <MainCard title={" סיכום הזמנה"}>
            {cart?.lines.length ? (
                cart.lines.map((product) => (
                    <Grid
                        container
                        key={product.id}
                        direction="row"       // 🛠 important: column instead of row
                        spacing={1}
                        sx={{
                            bgcolor: 'var(--color-bg)',
                            borderRadius: 2,
                            p: 2,
                            mb: 2,
                            direction: 'rtl',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'  // optional: soft card feel
                        }}
                    >
                        {/* Price */}
                        <Grid item>
                            <Typography fontWeight="bold" textAlign="right">
                                ₪{product.cost.totalAmount.amount}
                            </Typography>
                        </Grid>

                        {/* Product title */}
                        <Grid item>
                            <Typography fontWeight="medium" fontSize="0.9rem" textAlign="right">
                                {product.merchandise.product.title}
                            </Typography>
                        </Grid>

                        {/* Quantity */}
                        <Grid item>
                            <Typography variant="body2" color="var(--color-text)" textAlign="right">
                                כמות {product.quantity}
                            </Typography>
                        </Grid>

                        {/* Unit Price */}
                        <Grid item>
                            <Typography variant="body2" color="var(--color-text)" textAlign="right">
                                מחיר ליחידה&nbsp;
                                ₪{product.cost.unitAmount.amount}
                            </Typography>
                        </Grid>

                        {/* Image */}
                        <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                            <img
                                src={product.merchandise.product.featuredImage.url}
                                alt={product.merchandise.product.title}
                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                        </Grid>
                    </Grid>
                ))
            ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                    העגלה שלך ריקה
                </Typography>
            )}


            <Divider sx={{ my: 2, bgcolor: 'var(--color-border)' }} />

            <Grid container justifyContent="space-between" sx={{ direction: 'rtl' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                    סה"כ
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                    {cart?.cost.totalAmount.amount} {cart?.cost.totalAmount.currencyCode}
                </Typography>
            </Grid>
        </MainCard>
    );
}
