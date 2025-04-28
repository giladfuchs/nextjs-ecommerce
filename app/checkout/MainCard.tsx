import React, { Ref } from 'react';
import {
    Card,
    CardHeader,
    Divider,
    CardProps,
    CardHeaderProps,
} from '@mui/material';

// project imports
type KeyedObject = {
    [key: string]: string | number | KeyedObject | any;
};

// constant
const headerSX = {
    '& .MuiCardHeader-action': { mr: 0 },
};

// ==============================|| CUSTOM MAIN CARD ||============================== //

export interface MainCardProps extends KeyedObject {
    children: React.ReactNode | string;
    sx?: CardProps['sx'];
    secondary?: CardHeaderProps['action'];
    elevation?: number;
    title?: React.ReactNode | string;
}

const MainCard = React.forwardRef(
    (
        {
            children,
            secondary,
            sx = {},
            title,
        }: MainCardProps,
        ref: Ref<HTMLDivElement>
    ) => {
        return (
            <Card
                ref={ref}
                sx={{
                    border: '1px solid',
                    borderColor: 'var(--color-border)',
                    bgcolor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    ...sx
                }}
            >
                {title && (
                    <>
                        <CardHeader sx={headerSX} title={title} action={secondary} />
                        <Divider />
                    </>
                )}
                {children}
            </Card>
        );
    }
);

export default MainCard;
