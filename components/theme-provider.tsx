'use client';

import { ThemeProvider } from '@mui/material/styles';
import theme from '../lib/theme';
import { ReactNode } from 'react';

export function ThemeClientProvider({ children }: { children: ReactNode }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
