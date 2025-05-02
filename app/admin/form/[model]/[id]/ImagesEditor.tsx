"use client";

import * as React from "react";
import {SimpleTreeView} from "@mui/x-tree-view/SimpleTreeView";
import {TreeItem} from "@mui/x-tree-view/TreeItem";
import {Image} from "../../../../../lib/types";
import {Box, Button, Divider, Grid, TextField, Typography} from "@mui/material";
import {toast} from "sonner";
import ImageIcon from "@mui/icons-material/Image";

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
        updated[index] = {...updated[index], [field]: value};
        onChange(updated);
        setImagesState(updated);
    };

    return (
        <Box sx={{mt: 2}}>
            <SimpleTreeView>
                <TreeItem itemId="images" label={placeholder}>
                    <Grid container direction="column" spacing={3}>
                        <Button sx={{mt: 2}}
                                variant="outlined"
                                onClick={() => window.open('/admin/form/image', '_blank')}
                                startIcon={<ImageIcon/>}
                        >
                            הוסף תמונה
                        </Button>
                        {Array.from({length: 5}, (_, index) => (
                            <Grid item xs={12} key={index}>
                                <Typography fontWeight="bold">תמונה {index + 1}</Typography>
                                <Grid container direction="column" spacing={2}>
                                    <Grid direction="column" display="flex" alignItems="center" gap={1} item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="קישור לתמונה"
                                            value={imagesState[index]?.url || ""}
                                            onChange={(e) => handleChange(index, "url", e.target.value)}
                                        />

                                        <button
                                            type="button"
                                            title="הדבק מהלוח"
                                            onClick={async () => {
                                                try {
                                                    const text = await navigator.clipboard.readText();
                                                    if (text && text.startsWith("http")) {
                                                        handleChange(index, "url", text);
                                                        toast.success("📋 הכתובת הודבקה בהצלחה!", {
                                                            description: text,
                                                        });
                                                    } else {
                                                        toast.error("❌ הלוח לא מכיל כתובת חוקית");
                                                    }
                                                } catch (err) {
                                                    toast.error("⚠️ שגיאה בגישה ללוח", {
                                                        description: "נסה שוב או אפשר הרשאות",
                                                    });
                                                }
                                            }}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: 6,
                                                border: '1px solid #ccc',
                                                background: '#f9f9f9',
                                                borderRadius: 4,
                                                cursor: 'pointer',
                                                height: '56px', // match TextField height
                                            }}
                                        >
                                            📋
                                        </button>
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
                                <Divider sx={{my: 3}}/>
                            </Grid>
                        ))}
                    </Grid>
                </TreeItem>
            </SimpleTreeView>
        </Box>
    );
}
