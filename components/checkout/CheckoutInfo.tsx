"use client";

import {
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput,
    Typography,
} from "@mui/material";
import * as Yup from "yup";
import {Formik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../lib/store";
import {Cart, Order} from "lib/types";
import {submitOrder} from "../../lib/api";
import {clearCart} from "../../lib/store/cartSlice";
import {toast} from "sonner";
import {FormattedMessage, useIntl} from "react-intl";

const customInput = {
    marginTop: 1,
    marginBottom: 1,
    fontSize: "inherit",
    "& > label": {
        top: 23,
        left: 0,
        color: "#9e9e9e",
        fontSize: "inherit",
        '&[data-shrink="false"]': {top: 5},
    },
    "& > div > input": {
        padding: "30.5px 14px 11.5px !important",
        textAlign: "right",
        fontSize: "inherit",
    },
    "& legend": {display: "none"},
    "& fieldset": {top: 0},
};

const fields = [
    {name: "name", id: "checkout.name", type: "text"},
    {name: "email", id: "checkout.email", type: "text"},
    {name: "phone", id: "checkout.phone", type: "tel"},
];

export default function CheckoutInfo({
                                         onSuccess,
                                         onError,
                                     }: {
    onSuccess: (orderId: number) => void;
    onError: () => void;
}) {
    const cart: Cart = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const intl = useIntl();

    return (
        <Box
            sx={{
                width: "100%",
                mx: "auto",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                fontSize: "inherit",
            }}
        >
            <Typography variant="h4" textAlign="center" fontWeight="bold" mb={2}>
                <FormattedMessage id="checkout.contactDetails"/>
            </Typography>

            <Formik
                initialValues={{email: "", phone: "", name: ""}}
                validationSchema={Yup.object().shape({
                    name: Yup.string()
                        .min(2)
                        .max(255)
                        .required(intl.formatMessage({id: "form.error.name"})),
                    email: Yup.string()
                        .email(intl.formatMessage({id: "form.error.email"}))
                        .max(255)
                        .required(intl.formatMessage({id: "form.error.email"})),
                    phone: Yup.string()
                        .matches(
                            /^05\d{8}$/,
                            intl.formatMessage({id: "form.error.phone"}),
                        )
                        .required(intl.formatMessage({id: "form.error.phone"})),
                })}
                onSubmit={async (values, {setSubmitting}) => {
                    const trimmedValues = {
                        ...values,
                        name: values.name.trim(),
                        email: values.email.trim(),
                        phone: "0" + values.phone.trim().replace(/^0+/, ""),
                    };

                    const order: Order = {...trimmedValues, cart} as Order;

                    try {
                        const saved: Order = await submitOrder(order) as Order;
                        console.log(saved)
                        onSuccess(saved.id);
                        toast.success(intl.formatMessage({id: "checkout.success"}), {
                            description: intl.formatMessage(
                                {id: "checkout.orderId"},
                                {id: saved.id},
                            ),
                        });
                        dispatch(clearCart());
                    } catch (err) {
                        console.error("❌ Order failed:", err);
                        toast.error(intl.formatMessage({id: "checkout.error"}));
                        onError();
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({
                      errors,
                      handleBlur,
                      handleChange,
                      handleSubmit,
                      isSubmitting,
                      touched,
                      values,
                  }) => (
                    <form noValidate onSubmit={handleSubmit} dir="rtl">
                        <Box sx={{p: 2}}>
                            <Grid container direction="column" spacing={2}>
                                {fields.map((field) => (
                                    <Grid item key={field.name}>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(
                                                touched[field.name as keyof typeof touched] &&
                                                errors[field.name as keyof typeof errors],
                                            )}
                                            sx={customInput}
                                        >
                                            <InputLabel
                                                htmlFor={`outlined-${field.name}`}
                                                shrink
                                                sx={{
                                                    position: "absolute",
                                                    right: 14,
                                                    left: "unset",
                                                    transformOrigin: "top right",
                                                    transform: "translate(0, -1.5px) scale(0.75)",
                                                    fontSize: "inherit",
                                                }}
                                            >
                                                <FormattedMessage id={field.id}/>
                                            </InputLabel>
                                            <OutlinedInput
                                                id={`outlined-${field.name}`}
                                                type={field.type}
                                                value={values[field.name as keyof typeof values]}
                                                name={field.name}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{
                                                    dir: "rtl",
                                                    autoComplete:
                                                        field.name === "phone" ? "tel" : field.name,
                                                    style: {fontSize: "inherit"},
                                                }}
                                                sx={{
                                                    direction: "rtl",
                                                    fontSize: "inherit",
                                                    "& input": {textAlign: "right"},
                                                }}
                                            />
                                            {touched[field.name as keyof typeof touched] &&
                                                errors[field.name as keyof typeof errors] && (
                                                    <FormHelperText
                                                        sx={{textAlign: "right", marginRight: 1}}
                                                    >
                                                        {errors[field.name as keyof typeof errors]}
                                                    </FormHelperText>
                                                )}
                                        </FormControl>
                                    </Grid>
                                ))}

                                <Divider/>

                                <Grid item>
                                    <Button
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting}
                                    >
                                        <FormattedMessage id="checkout.submit"/>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
}
