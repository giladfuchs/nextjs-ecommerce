'use client';

import * as React from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {Image} from "../../../../lib/types";
import { Box, Divider, Grid, TextField, Typography } from '@mui/material';

export default function ImagesEditor({
                                         images,
                                         onChange,
                                     }: {
    images: Image[];
    onChange: (images: Image[]) => void;
}) {
    const handleChange = (index: number, field: keyof Image, value: string) => {
        const updated = [...images];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };
    return (
        <Box sx={{ mt: 2 }}>
            <SimpleTreeView>
                <TreeItem itemId="images" label="תמונות המוצר">
                    <Grid container direction="column"  spacing={3}>
                        {[0, 1, 2, 3, 4].map((index) => (
                            <Grid item xs={12} key={index}>
                                <Typography fontWeight="bold">תמונה {index + 1}</Typography>
                                <Grid container direction="column" spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="קישור לתמונה"
                                            value={images[index]?.url || ''}
                                            onChange={(e) => handleChange(index, 'url', e.target.value)}

                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="תיאור תמונה (alt)"
                                            value={images[index]?.altText || ''}
                                            onChange={(e) => handleChange(index, 'altText', e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Divider sx={{ my: 3 }} />
                            </Grid>
                        )) }
                    </Grid>
                </TreeItem>
            </SimpleTreeView>
        </Box>
    );
}
