import {notFound} from 'next/navigation';
import Price from 'components/price';
import {getOrderById} from "../../../../lib/api";

import {
    Box,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,

    Typography
} from '@mui/material';
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import PhonelinkRingTwoToneIcon from '@mui/icons-material/PhonelinkRingTwoTone';
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import ShoppingBagTwoToneIcon from '@mui/icons-material/ShoppingBagTwoTone';

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
            <Grid container justifyContent="center" sx={{ direction: 'rtl', mb: 4 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <List component="nav" disablePadding>
                                <ListItem disableGutters>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <PersonTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography variant="subtitle1">שם מלא</Typography>}
                                        secondary={<Typography variant="body2">{order.name}</Typography>}
                                        sx={{ textAlign: 'right' }}
                                    />
                                </ListItem>

                                <ListItem disableGutters>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography variant="subtitle1">אימייל</Typography>}
                                        secondary={<Typography variant="body2">{order.email}</Typography>}
                                        sx={{ textAlign: 'right' }}
                                    />
                                </ListItem>

                                <ListItem disableGutters>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <PhonelinkRingTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography variant="subtitle1">טלפון</Typography>}
                                        secondary={<Typography variant="body2">{order.phone}</Typography>}
                                        sx={{ textAlign: 'right' }}
                                    />
                                </ListItem>
                            </List>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <List component="nav" disablePadding>
                                <ListItem disableGutters>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <AccessTimeTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography variant="subtitle1">תאריך יצירה</Typography>}
                                        secondary={
                                            <Typography variant="body2">
                                                {new Date(order.createdAt).toLocaleDateString('he-IL')}
                                            </Typography>
                                        }
                                        sx={{ textAlign: 'right' }}
                                    />
                                </ListItem>

                                <ListItem disableGutters>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <ShoppingBagTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography variant="subtitle1">כמות מוצרים</Typography>}
                                        secondary={
                                            <Typography variant="body2">{order.totalQuantity}</Typography>
                                        }
                                        sx={{ textAlign: 'right' }}
                                    />
                                </ListItem>

                                <ListItem disableGutters>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <MonetizationOnTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography variant="subtitle1">סה״כ לתשלום</Typography>}
                                        secondary={<Price amount={order.cost} />}
                                        sx={{ textAlign: 'right' }}
                                    />
                                </ListItem>
                            </List>
                        </Grid>
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