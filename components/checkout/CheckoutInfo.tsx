"use client";

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
  Checkbox,
} from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../lib/store";
import { Cart, NewOrderPayload, Order } from "lib/types";
import { localeCache, submitOrder } from "../../lib/api";
import { clearCart } from "../../lib/store/cartSlice";
import { toast } from "sonner";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";

const customInput = {
  marginTop: 1,
  marginBottom: 1,
  fontSize: "inherit",
  "& > label": {
    top: 23,
    left: 0,
    color: "#9e9e9e",
    fontSize: "inherit",
    '&[data-shrink="false"]': { top: 5 },
  },
  "& > div > input": {
    padding: "30.5px 14px 11.5px !important",
    textAlign: "right",
    fontSize: "inherit",
  },
  "& legend": { display: "none" },
  "& fieldset": { top: 0 },
};

const fields = [
  { name: "name", id: "checkout.name", type: "text" },
  { name: "email", id: "checkout.email", type: "text" },
  { name: "phone", id: "checkout.phone", type: "tel" },
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
      data-testid="checkout-page"
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
        <FormattedMessage id="checkout.contactDetails" />
      </Typography>

      <Formik
        initialValues={{ email: "", phone: "", name: "", agreed: false }}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .min(2)
            .max(255)
            .required(intl.formatMessage({ id: "form.error.name" })),
          email: Yup.string()
            .email(intl.formatMessage({ id: "form.error.email" }))
            .max(255)
            .required(intl.formatMessage({ id: "form.error.email" })),
          phone: Yup.string()
            .matches(
              /^05\d{8}$/,
              intl.formatMessage({ id: "form.error.phone" }),
            )
            .required(intl.formatMessage({ id: "form.error.phone" })),
          agreed: Yup.boolean()
            .oneOf([true], intl.formatMessage({ id: "form.error.agree" }))
            .required(),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          const trimmedValues = {
            ...values,
            name: values.name.trim(),
            email: values.email.trim(),
            phone: "0" + values.phone.trim().replace(/^0+/, ""),
          };

          const order: NewOrderPayload = { ...trimmedValues, cart };

          try {
            const saved: Order = (await submitOrder(order)) as Order;
            onSuccess(saved.id);
            toast.success(intl.formatMessage({ id: "checkout.success" }), {
              description: intl.formatMessage(
                { id: "checkout.orderId" },
                { id: saved.id },
              ),
            });
            dispatch(clearCart());
          } catch (err) {
            console.error("❌ Order failed:", err);
            toast.error(intl.formatMessage({ id: "checkout.error" }));
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
          <form noValidate onSubmit={handleSubmit} dir={localeCache.dir()}>
            <Box sx={{ p: 2 }}>
              <Grid container direction="column" spacing={2}>
                {fields.map((field) => (
                  <Grid item key={field.name}>
                    <FormControl
                      fullWidth
                      error={
                        touched[field.name as keyof typeof touched] &&
                        Boolean(errors[field.name as keyof typeof errors])
                      }
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
                        <FormattedMessage id={field.id} />
                      </InputLabel>
                      <OutlinedInput
                        id={`outlined-${field.name}`}
                        type={field.type}
                        value={values[field.name as keyof typeof values]}
                        name={field.name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{
                          dir: localeCache.dir(),
                          autoComplete:
                            field.name === "phone" ? "tel" : field.name,
                          style: { fontSize: "inherit" },
                          "data-testid": `checkout-input-${field.name}`,
                        }}
                        sx={{
                          direction: localeCache.dir(),
                          fontSize: "inherit",
                          "& input": { textAlign: "right" },
                        }}
                      />
                      {touched[field.name as keyof typeof touched] &&
                        errors[field.name as keyof typeof errors] && (
                          <FormHelperText
                            data-testid={`checkout-error-${field.name}`}
                            sx={{ textAlign: "right", marginRight: 1 }}
                          >
                            {String(errors[field.name as keyof typeof errors])}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                ))}

                <FormControl
                  required
                  error={Boolean(touched.agreed && errors.agreed)}
                >
                  <FormControlLabel
                    sx={{ mr: 0, justifyContent: "flex-end", ml: "auto" }}
                    control={
                      <Checkbox
                        checked={values.agreed}
                        onChange={handleChange}
                        name="agreed"
                        color="primary"
                        sx={{ ml: 1 }}
                        data-testid="checkout-agree"
                      />
                    }
                    label={
                      <Typography fontSize="0.9rem" textAlign="right">
                        <FormattedMessage
                          id="checkout.agreeToTerms"
                          values={{
                            link: (
                              <Link
                                href="/legal/terms"
                                target="_blank"
                                style={{ textDecoration: "underline" }}
                              >
                                <FormattedMessage id="checkout.termsLinkText" />
                              </Link>
                            ),
                          }}
                        />
                      </Typography>
                    }
                  />
                  {touched.agreed && errors.agreed && (
                    <FormHelperText
                      data-testid="checkout-error-agreed"
                      sx={{ textAlign: "right" }}
                    >
                      {String(errors.agreed)}
                    </FormHelperText>
                  )}
                </FormControl>

                <Divider />

                <Grid item>
                  <Typography
                    variant="h3"
                    component="h3"
                    fontWeight="normal"
                    fontSize="0.9rem"
                    color="text.secondary"
                    textAlign="right"
                    maxWidth={280}
                    sx={{ width: "fit-content", ml: "auto", mr: 0 }}
                  >
                    <FormattedMessage id="checkout.pickupNotice" />
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    data-testid="checkout-submit"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    <FormattedMessage id="checkout.submit" />
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
