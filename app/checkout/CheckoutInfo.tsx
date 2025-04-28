'use client';

import {
    Box,
    Button, Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput,
    Typography
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
const customInput = {
    marginTop: 1,
    marginBottom: 1,
    '& > label': {
        top: 23,
        left: 0,
        color: '#9e9e9e',
        '&[data-shrink="false"]': { top: 5 }
    },
    '& > div > input': {
        padding: '30.5px 14px 11.5px !important',
        textAlign: 'right'
    },
    '& legend': { display: 'none' },
    '& fieldset': { top: 0 }
};

// 🛠 Define your fields
const fields = [
    {
        name: 'name',
        label: 'שם מלא',
        type: 'text',
    },
    {
        name: 'email',
        label: 'אימייל',
        type: 'text',
    },
    {
        name: 'phone',
        label: 'טלפון',
        type: 'number',
    },
];

const CheckoutInfo = () => {
    return (
        <Box             sx={{
            width: '100%',
            mx: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        }}>
            <Grid container direction="column" spacing={2}>

                    <Typography variant="h4" textAlign="center" fontWeight="bold" mb={2}>
                        פרטי קשר
                    </Typography>
                <Grid item>
                    <Formik
                        initialValues={{
                            email: '',
                            phone: '',
                            name: '',
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().min(5).max(255).required('חובה למלא שם מלא'),
                            email: Yup.string()
                                .email('חובה למלא אימייל תקין')
                                .max(255)
                                .required('חובה למלא אימייל תקין'),
                            phone: Yup.string()
                                .matches(/^\d+$/, 'הטלפון חייב להכיל ספרות בלבד')
                                .min(8, 'מספר טלפון חייב להיות לפחות 8 ספרות')
                                .max(15, 'מספר טלפון לא יכול להיות יותר מ-15 ספרות')
                                .required('חובה למלא טלפון')
                        })}
                        onSubmit={(values) => console.log(values)}
                    >
                        {({
                              errors,
                              handleBlur,
                              handleChange,
                              handleSubmit,
                              isSubmitting,
                              touched,
                              values
                          }) => (
                            <form noValidate onSubmit={handleSubmit} dir="rtl">
                                <Box sx={{ p: 2 }}>
                                    <Grid container direction="column" spacing={2}>
                                        {fields.map((field) => (
                                            <Grid item key={field.name}>
                                                <FormControl
                                                    fullWidth
                                                    error={Boolean(touched[field.name as keyof typeof touched] && errors[field.name as keyof typeof errors])}
                                                    sx={{ ...customInput }}
                                                >
                                                    <InputLabel
                                                        htmlFor={`outlined-adornment-${field.name}-info`}
                                                        shrink
                                                        sx={{
                                                            position: 'absolute',
                                                            right: 14,
                                                            left: 'unset',
                                                            transformOrigin: 'top right',
                                                            transform: 'translate(0, -1.5px) scale(0.75)'
                                                        }}
                                                    >
                                                        {field.label}
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        id={`outlined-adornment-${field.name}-info`}
                                                        type={field.type}
                                                        value={values[field.name as keyof typeof values]}
                                                        name={field.name}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        label={field.label}
                                                        inputProps={{ dir: 'rtl' }}
                                                        sx={{
                                                            direction: 'rtl',
                                                            '& input': { textAlign: 'right' }
                                                        }}
                                                    />
                                                    {touched[field.name as keyof typeof touched] && errors[field.name as keyof typeof errors] && (
                                                        <FormHelperText
                                                            error
                                                            sx={{ textAlign: 'right', marginRight: 1 }}
                                                        >
                                                            {errors[field.name as keyof typeof errors]}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                        ))}
                                        <Divider />
                                        <Grid item>
                                            <Button
                                                fullWidth
                                                size="large"
                                                type="submit"
                                                variant="contained"
                                                disabled={isSubmitting}
                                                sx={{
                                                    backgroundColor: 'var(--color-accent)',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    borderRadius: 2,
                                                    py: 1.5,
                                                    '&:hover': { backgroundColor: 'var(--color-accent)' }
                                                }}
                                            >
                                                בצע הזמנה
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </form>

                        )}
                    </Formik>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CheckoutInfo;
