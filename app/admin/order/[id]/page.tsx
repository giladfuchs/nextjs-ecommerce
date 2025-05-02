import {notFound} from 'next/navigation';
import {Box, Divider, Grid, Typography} from '@mui/material';
import Price from 'components/price';
import {getOrderById} from "../../../../lib/api";


export default async function OrderViewPage({
                                                params,
                                            }: {
    params: { id: string };
}) {
    const {id} = await params;
    const order = await getOrderById(Number(id));

    if (!order) return notFound();

    return (
        <Box sx={{maxWidth: 800, mx: 'auto', p: 3, direction: 'rtl'}}>
            <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
                הזמנה #{order.id}
            </Typography>

            <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">👤 {order.name}</Typography>
                    <Typography variant="body2">📧 {order.email}</Typography>
                    <Typography variant="body2">📱 {order.phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} textAlign="left">
                    <Typography variant="body2">
                        🕒 {new Date(order.createdAt).toLocaleString('he-IL')}
                    </Typography>
                    <Typography variant="body2">🧺 כמות: {order.totalQuantity}</Typography>
                    <Typography variant="body2">
                        💰 סה"כ: <Price amount={order.cost}/>
                    </Typography>
                </Grid>
            </Grid>

            <Divider sx={{my: 2}}/>

            {order.items.map((product: any) => (
                <Grid
                    key={product.id}
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
                        mb: 2,
                    }}
                >
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

                    <Grid item sx={{flexGrow: 1, minWidth: 0}}>
                        <Typography fontWeight="bold">{product.title}</Typography>
                        <Typography variant="body2">
                            כמות: {product.quantity} × <Price amount={product.unitAmount}/>
                        </Typography>
                    </Grid>

                    <Typography fontWeight="bold" sx={{minWidth: 80}}>
                        <Price amount={product.totalAmount}/>
                    </Typography>
                </Grid>
            ))}
        </Box>
    );
}