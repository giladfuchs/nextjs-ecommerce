'use client';

import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    IconButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { toast } from 'sonner';
import { uploadImage } from '../../../../lib/api';
import { MAX_FILE_SIZE_MB } from '../../../../lib/utils';

export default function UploadImagePage() {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) return;

        try {
            setLoading(true);
            const url = await uploadImage(file);
            setImageUrl(url);

            toast.success('✅ התמונה הועלתה בהצלחה!', {
                description: `URL: ${url}`,
            });
        } catch (err: any) {
            toast.error('❌ שגיאה בהעלאה', {
                description: err?.message || 'נסה שוב בעוד רגע',
            });
            setImageUrl(null);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        if (!imageUrl) return;
        await navigator.clipboard.writeText(imageUrl);
        toast.success('📋 הועתק ללוח!');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        const isImage = selectedFile.type.startsWith('image/');
        const isTooLarge = selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024;

        if (!isImage) {
            toast.error('❌ קובץ לא תקין. רק תמונות מותרות');
            return;
        }

        if (isTooLarge) {
            toast.error('❌ גודל הקובץ גדול מדי. עד 1MB בלבד');
            return;
        }

        setFile(selectedFile);
    };

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 2 }}>
            <Box textAlign="center">
                <Typography variant="h5" mb={2}>
                    העלאת תמונה
                </Typography>

                <Box mt={2}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <input
                            accept="image/*"
                            type="file"
                            id="upload-input"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />

                        <label htmlFor="upload-input">
                            <Button variant="outlined" component="span">
                                {file ? '🔁 שנה תמונה' : '📁 בחר תמונה'}
                            </Button>
                        </label>
                    </Box>

                    {file && (
                        <Typography
                            variant="body1"
                            mt={1}
                            sx={{
                                bgcolor: '#f4f4f4',
                                px: 2,
                                py: 1,
                                borderRadius: 1,
                                border: '1px solid #ccc',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: '#333',
                                display: 'inline-block',
                            }}
                        >
                            📎 {file.name}
                        </Typography>
                    )}
                </Box>

                <Box mt={2}>
                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={!file || loading}
                        startIcon={loading ? <CircularProgress size={20} /> : undefined}
                    >
                        העלה תמונה
                    </Button>
                </Box>
            </Box>

            {imageUrl && (
                <Box mt={4} textAlign="center">
                    <Typography variant="body1" gutterBottom>
                        כתובת התמונה:
                    </Typography>

                    <Box mt={3}>
                        <Box
                            display="flex"
                            gap={2}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <IconButton onClick={copyToClipboard} title="העתק ללוח">
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>

                            <IconButton
                                href={imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="פתח בלשונית חדשה"
                            >
                                <OpenInNewIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <Typography
                            variant="body2"
                            mt={1}
                            sx={{
                                wordBreak: 'break-all',
                                fontSize: '0.875rem',
                                color: '#333',
                                p: 1,
                                borderRadius: 1,
                                bgcolor: '#f4f4f4',
                                border: '1px solid #ccc',
                            }}
                        >
                            {imageUrl}
                        </Typography>
                    </Box>

                    <Box mt={2} p={1} border="1px solid #ccc" borderRadius={2}>
                        <img
                            src={imageUrl}
                            alt="Uploaded"
                            style={{ maxWidth: '100%', borderRadius: 8 }}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    );
}