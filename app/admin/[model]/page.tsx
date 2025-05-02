'use client';

import * as React from 'react';
import { use, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Divider,
    Grid,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';

import { ModelType } from '../form/form';
import {
    getCollections,
    getOrders,
    getProducts,
} from '../../../lib/api';
import {
    AGTableModelType,
    get_columns_by_title,
} from '../ag_table';
import { ColDef } from 'ag-grid-community';
import AGTable from '../AGTable';
import { useRouter } from 'next/navigation';

export default function AdminPage({
                                      params,
                                  }: {
    params: Promise<{ model: ModelType }>;
}) {
    const router = useRouter();
    const { model } = use(params);

    const [rows, setRows] = useState<AGTableModelType[]>([]);
    const [searchValue, setSearchValue] = useState('');

    const cols: ColDef<AGTableModelType>[] = get_columns_by_title(model);

    React.useEffect(() => {
        const init = async () => {
            const objs =
                model === ModelType.product
                    ? await getProducts()
                    : model === ModelType.order
                        ? await getOrders()
                        : await getCollections();
            setRows(objs);
        };

        init();
    }, [model]);

    const filteredRows = React.useMemo(() => {
        if (!searchValue) return rows;

        const regex = new RegExp(searchValue, 'i');
        return rows.filter((row) =>
            regex.test(Object.values(row).join(' '))
        );
    }, [searchValue, rows]);

    return (
        <Container disableGutters sx={{ px: 2 }}>
            <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                direction="row"
            >
                <Typography variant="h5" fontWeight="bold">
                    {model} table
                </Typography>

                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="חיפוש..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    sx={{ minWidth: 200 }}
                />

                {model !== ModelType.order && (
                    <Grid item display="flex" gap={2}>
                        <Button
                            variant="contained"
                            onClick={() => router.push(`/admin/form/${model}/add`)}
                            startIcon={<AddIcon />}
                        >
                            הוסף
                        </Button>

                        {model === ModelType.product && (
                            <Button
                                variant="outlined"
                                onClick={() => window.open('/admin/form/image', '_blank')}
                                startIcon={<ImageIcon />}
                            >
                                הוסף תמונה
                            </Button>
                        )}
                    </Grid>
                )}
            </Grid>

            <Grid container justifyContent="center" mt={2}>
                <AGTable cols={cols} rows={filteredRows} />
            </Grid>
        </Container>
    );
}