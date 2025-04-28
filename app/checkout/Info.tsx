'use client';

import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput,
    Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// custom input styling
const customInput = {
    marginTop: 1,
    marginBottom: 1,
    '& > label': {
        top: 23,
        left: 0,
        color: '#9e9e9e',
        '&[data-shrink="false"]': {
            top: 5
        }
    },
    '& > div > input': {
        padding: '30.5px 14px 11.5px !important',
        textAlign: 'right'
    },
    '& legend': {
        display: 'none'
    },
    '& fieldset': {
        top: 0
    }
};

const Info = () => {
    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                        <Typography variant="subtitle1">פרטי קשר</Typography>
                    </Box>
            </Grid>

            <Formik
                initialValues={{
                    email: '',
                    phone: '',
                    name: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    name: Yup.string().min(5).max(255).required('חובה למלא שם מלא'),
                    email: Yup.string().email('חובה למלא אימייל תקין').max(255).required('חובה למלא אימייל תקין'),
                    phone: Yup.string()
                        .matches(/^\d+$/, 'הטלפון חייב להכיל ספרות בלבד')
                        .min(8, 'מספר טלפון חייב להיות לפחות 8 ספרות')
                        .max(15, 'מספר טלפון לא יכול להיות יותר מ-15 ספרות')
                        .required('חובה למלא טלפון')
                })}
                onSubmit={(values) => {
                    console.log(values);
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} dir="rtl">

                        {/* Name */}
                        <FormControl fullWidth error={Boolean(touched.name && errors.name)} sx={{ ...customInput }}>
                            <InputLabel
                                htmlFor="outlined-adornment-name-info"
                                shrink
                                sx={{
                                    position: "absolute",
                                    right: 14,
                                    left: "unset",
                                    transformOrigin: "top right",
                                    transform: "translate(0, -1.5px) scale(0.75)"
                                }}
                            >
                                שם מלא
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-name-info"
                                type="text"
                                value={values.name}
                                name="name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="שם מלא"
                                inputProps={{ dir: "rtl" }}
                                sx={{
                                    direction: "rtl",
                                    "& input": { textAlign: "right" }
                                }}
                            />
                            {touched.name && errors.name && (
                                <FormHelperText
                                    error
                                    id="standard-weight-helper-text-name-info"
                                    sx={{ textAlign: "right", marginRight: 1 }}
                                >
                                    {errors.name}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {/* Email */}
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...customInput }}>
                            <InputLabel
                                htmlFor="outlined-adornment-email-info"
                                shrink
                                sx={{
                                    position: "absolute",
                                    right: 14,
                                    left: "unset",
                                    transformOrigin: "top right",
                                    transform: "translate(0, -1.5px) scale(0.75)"
                                }}
                            >
                                אימייל
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-info"
                                type="text"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="אימייל"
                                inputProps={{ dir: "rtl" }}
                                sx={{
                                    direction: "rtl",
                                    "& input": { textAlign: "right" }
                                }}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText
                                    error
                                    id="standard-weight-helper-text-email-info"
                                    sx={{ textAlign: "right", marginRight: 1 }}
                                >
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {/* Phone */}
                        <FormControl fullWidth error={Boolean(touched.phone && errors.phone)} sx={{ ...customInput }}>
                            <InputLabel
                                htmlFor="outlined-adornment-phone-info"
                                shrink
                                sx={{
                                    position: "absolute",
                                    right: 14,
                                    left: "unset",
                                    transformOrigin: "top right",
                                    transform: "translate(0, -1.5px) scale(0.75)"
                                }}
                            >
                                טלפון
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-phone-info"
                                type="tel"
                                value={values.phone}
                                name="phone"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="טלפון"
                                inputProps={{
                                    dir: "rtl",
                                    maxLength: 15
                                }}
                                sx={{
                                    direction: "rtl",
                                    "& input": { textAlign: "right" }
                                }}
                            />
                            {touched.phone && errors.phone && (
                                <FormHelperText
                                    error
                                    id="standard-weight-helper-text-phone-info"
                                    sx={{ textAlign: "right", marginRight: 1 }}
                                >
                                    {errors.phone}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {/* Submit Errors */}
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        {/* Submit Button */}
                        <Box sx={{ mt: 2 }}>
                            <Button
                                disableElevation
                                disabled={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: "var(--color-accent)",
                                    color: "white",
                                    fontWeight: "bold",
                                    borderRadius: 2,
                                    py: 1.5,
                                    '&:hover': {
                                        backgroundColor: "var(--color-accent)"
                                    }
                                }}
                            >
                                בצע הזמנה
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default Info;
