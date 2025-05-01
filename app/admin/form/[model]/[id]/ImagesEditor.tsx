"use client";

import * as React from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { Image } from "../../../../../lib/types";
import { Box, Divider, Grid, TextField, Typography } from "@mui/material";

export default function ImagesEditor({
                                         placeholder,
                                         images,
                                         onChange,
                                     }: {
    placeholder: string;
    images: Image[];
    onChange: (value: any) => void;
}) {
    const [imagesState, setImagesState] = React.useState<Image[]>(images);

    const handleChange = (index: number, field: keyof Image, value: string) => {
        const updated = [...imagesState];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
        setImagesState(updated);
    };

    return (
        <Box sx={{ mt: 2 }}>
            <SimpleTreeView>
                <TreeItem itemId="images" label={placeholder}>
                    <Grid container direction="column" spacing={3}>
                        {Array.from({ length: 5 }, (_, index) => (
                            <Grid item xs={12} key={index}>
                                <Typography fontWeight="bold">תמונה {index + 1}</Typography>
                                <Grid container direction="column" spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="קישור לתמונה"
                                            value={imagesState[index]?.url || ""}
                                            onChange={(e) =>
                                                handleChange(index, "url", e.target.value)
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="תיאור תמונה (alt)"
                                            value={imagesState[index]?.altText || ""}
                                            onChange={(e) =>
                                                handleChange(index, "altText", e.target.value)
                                            }
                                        />
                                    </Grid>
                                    {imagesState[index]?.url?.trim() && (
                                            <Box
                                                component="img"
                                                src={imagesState[index].url}
                                                alt="כתובת התמונה לא טובה"
                                                sx={{
                                                    maxWidth: "100%",
                                                    maxHeight: 150,
                                                    borderRadius: 2,
                                                    border: "1px solid #ccc",
                                                }}
                                            />
                                    )}
                                </Grid>
                                <Divider sx={{ my: 3 }} />
                            </Grid>
                        ))}
                    </Grid>
                </TreeItem>
            </SimpleTreeView>
        </Box>
    );
}
