'use client'

import React from 'react';
import {Grid, Button, TextField, Autocomplete, Typography} from '@mui/material';
import {FieldAutoComplete, FormField, FormType} from "./form";

type FormFieldProps = {
    field: FormField;
    collections: string[];

    onChange: (value: any, key: string) => void;
};

const FieldRenderer = ({field, onChange, collections}: FormFieldProps) => {
    const placeholder = field.key
    switch (field.type) {
        case FormType.AutoComplete:
            if(field.key === 'collection')
                (field as FieldAutoComplete).options =collections
            return (
                <Autocomplete
                    disablePortal
                    options={(field as FieldAutoComplete).options}
                    value={field.value}
                    onChange={(e, value) => onChange(value, field.key)}
                    renderInput={(params) => <TextField {...params} label={field.key}/>}
                />
            );
        case FormType.TEXT:
        case FormType.TEXTAREA:
        case FormType.NUMBER:
        default:
            return (
                <TextField
                    fullWidth
                    variant="outlined"
                    label={placeholder}
                    placeholder={placeholder}
                    value={field.value}
                    type={field.type === FormType.NUMBER ? 'number' : 'text'}
                    multiline={field.type === FormType.TEXTAREA}
                    rows={field.type === FormType.TEXTAREA ? 5 : undefined}
                    onChange={(e) => onChange(e.target.value, field.key)}
                />
            );
    }
};

interface FormChildProps {
    title: string;
    collections: string[];
    fields: FormField[];
    onSubmit: (send_fields: FormField[]) => void;
}

export default function FormChild({title, fields, onSubmit, collections}: FormChildProps) {
    const [localFields, setLocalFields] = React.useState<FormField[]>(fields);
    const handleChange = (value: any, key: string) => {
        const updatedFields = localFields.map((field) => {
            if (field.key === key) {
                return {...field, value};
            }
            return field;
        });
        setLocalFields(updatedFields);
    };

    const handleSubmit = () => {
        onSubmit(localFields);
    };
    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} md={6} lg={4}>
                <Typography variant="h4" textAlign="center" fontWeight="bold" mb={2}>
                    {title}
                </Typography>

                <Grid container direction="column" spacing={3}>
                    {localFields.map((field) => (
                        <Grid item key={field.key}>
                            <FieldRenderer field={field} onChange={handleChange} collections={collections} />
                        </Grid>
                    ))}

                    <Grid item display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontWeight: 'bold',
                                backgroundColor: 'var(--color-accent)',
                                '&:hover': {
                                    backgroundColor: 'var(--color-accent)',
                                    opacity: 0.9,
                                },
                            }}
                        >
                            שלח
                        </Button>
                    </Grid>
                </Grid>



            </Grid>
        </Grid>
    );
}
