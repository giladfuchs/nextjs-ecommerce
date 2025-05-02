'use client';

import {notFound} from 'next/navigation';
import Price from 'components/price';
import {getOrderById, updateOrderStatus} from "../../../../lib/api";

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
import {use, useState} from "react";
import * as React from "react";
import {Order, OrderStatus} from "../../../../lib/types";
import {toast} from "sonner";

export default function OrderViewPage({
                                          params,
                                      }: {
    params: Promise<{ id: string }>;
}) {
    const {id} = use(params);
    const [order, setOrder] = useState<Order | undefined | null>(undefined);

    React.useEffect(() => {
        const init = async () => {
            const obj = await getOrderById(Number(id));

            setOrder(obj);
        };

        init();
    }, []);
    if (order === null) return notFound();

    const statusOptions: Record<OrderStatus, OrderStatus[]> = {
        [OrderStatus.NEW]: [OrderStatus.READY, OrderStatus.DONE, OrderStatus.CANCELED],
        [OrderStatus.READY]: [OrderStatus.DONE, OrderStatus.CANCELED],
        [OrderStatus.DONE]: [],
        [OrderStatus.CANCELED]: [OrderStatus.NEW],
    };
    return (order && <Box sx={{maxWidth: 800, mx: 'auto', p: 3, direction: 'rtl'}}>
            <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
                הזמנה #{order.id}
            </Typography>
            <Grid container justifyContent="center" sx={{direction: 'rtl', mb: 4}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <List component="nav" disablePadding>
                            <ListItem disableGutters>
                                <ListItemIcon sx={{minWidth: 40}}>
                                    <PersonTwoToneIcon sx={{fontSize: '1.3rem'}}/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="subtitle1">שם מלא</Typography>}
                                    secondary={<Typography variant="body2">{order.name}</Typography>}
                                    sx={{textAlign: 'right'}}
                                />
                            </ListItem>

                            <ListItem disableGutters>
                                <ListItemIcon sx={{minWidth: 40}}>
                                    <MailTwoToneIcon sx={{fontSize: '1.3rem'}}/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="subtitle1">אימייל</Typography>}
                                    secondary={<Typography variant="body2">{order.email}</Typography>}
                                    sx={{textAlign: 'right'}}
                                />
                            </ListItem>

                            <ListItem disableGutters>
                                <ListItemIcon sx={{minWidth: 40}}>
                                    <PhonelinkRingTwoToneIcon sx={{fontSize: '1.3rem'}}/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="subtitle1">טלפון</Typography>}
                                    secondary={<Typography variant="body2">{order.phone}</Typography>}
                                    sx={{textAlign: 'right'}}
                                />
                            </ListItem>
                        </List>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <List component="nav" disablePadding>
                            <ListItem disableGutters>
                                <ListItemIcon sx={{minWidth: 40}}>
                                    <AccessTimeTwoToneIcon sx={{fontSize: '1.3rem'}}/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="subtitle1">תאריך הזמנה</Typography>}
                                    secondary={
                                        <Typography variant="body2">
                                            {new Date(order.createdAt).toLocaleDateString('he-IL')}
                                        </Typography>
                                    }
                                    sx={{textAlign: 'right'}}
                                />
                            </ListItem>

                            <ListItem disableGutters>
                                <ListItemIcon sx={{minWidth: 40}}>
                                    <ShoppingBagTwoToneIcon sx={{fontSize: '1.3rem'}}/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="subtitle1">כמות מוצרים</Typography>}
                                    secondary={
                                        <Typography variant="body2">{order.totalQuantity}</Typography>
                                    }
                                    sx={{textAlign: 'right'}}
                                />
                            </ListItem>

                            <ListItem disableGutters>
                                <ListItemIcon sx={{minWidth: 40}}>
                                    <MonetizationOnTwoToneIcon sx={{fontSize: '1.3rem'}}/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="subtitle1">סה״כ לתשלום</Typography>}
                                    secondary={<Price amount={order.cost}/>}
                                    sx={{textAlign: 'right'}}
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
            <Typography
                variant="h4"
                color="primary"
                textAlign="center"
                sx={{mb: 2, fontWeight: 'bold', textTransform: 'uppercase'}}
            >
                סטטוס: {order.status}
            </Typography>
            {statusOptions[order.status].length > 0 && (
                <Box textAlign="center" mt={4}>
                    <Typography variant="h6" gutterBottom>
                        עדכן סטטוס:
                    </Typography>

                    <Grid container justifyContent="center" spacing={2}>
                        {statusOptions[order.status].map((nextStatus) => (
                            <Grid item key={nextStatus}>
                                <button
                                    onClick={async () => {
                                        try {
                                            const updated = await updateOrderStatus((order as Order).id, nextStatus);

                                            toast.success('✅ סטטוס עודכן בהצלחה!', {
                                                description: `סטטוס חדש: ${nextStatus}`,
                                            });

                                            setOrder(updated);
                                        } catch (err: any) {
                                            toast.error('❌ שגיאה בעדכון סטטוס', {
                                                description: err?.message || 'נסה שוב בעוד רגע',
                                            });
                                        }
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        backgroundColor: 'var(--color-accent)',
                                        color: 'white',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    {nextStatus}
                                </button>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Box>


    );
}