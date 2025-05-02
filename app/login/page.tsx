'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { toast } from 'sonner';
import {loginUser} from "../../lib/api"; // ✅ only this

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsernamename] = useState('admin');
    const [password, setPassword] = useState('yaara');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            await loginUser(username, password);
            toast.success('✅ התחברות הצליחה', {
                description: 'מעביר ללוח הניהול...',
            });
            router.push('/admin');
        } catch (err: any) {
            toast.error('שגיאת התחברות', {
                description: err.message || 'התחברות נכשלה',
            });
        }
    }

    return (
        <Container maxWidth="sm">
            <Box component="form" onSubmit={handleSubmit} mt={8} display="flex" flexDirection="column" gap={2}>
                <Typography variant="h4" fontWeight="bold" textAlign="center">
                    התחברות
                </Typography>

                <TextField
                    label="שם משתמש"
                    value={username}
                    onChange={e => setUsernamename(e.target.value)}
                    required
                />
                <TextField
                    label="סיסמא"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" fullWidth>
                    התחבר
                </Button>
            </Box>
        </Container>
    );
}