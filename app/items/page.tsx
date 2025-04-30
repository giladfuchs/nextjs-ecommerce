"use client";


import * as React from 'react';

import {Container, Grid, Paper} from '@mui/material';

import {use, useState} from 'react';
import {

    ModelType
} from "../form/form";
import {getProducts} from "../../lib/api";
import {AGTableModelType, get_columns_by_title} from "./ag_table";
import {ColDef} from "ag-grid-community";
import AGTable from "./AGTable";

export default function ItemsPage({
                                      params,
                                  }: {
    params: Promise<{ model: ModelType }>;
}) {
    const {model} = use(params);
    const [rows, setRows] = useState<AGTableModelType[]>([]);

    const cols: ColDef<AGTableModelType>[] = get_columns_by_title(model);

    React.useEffect(() => {
        const init = async () => {
            const products = await getProducts();
            setRows(products)
        }

        init();
    }, [model]);
    return (
        <Container maxWidth={false} disableGutters sx={{ px: 0 }}>

        <Grid

        >
            <Paper sx={{width: '100%', mb: 2}}>
                <AGTable cols={cols} rows={rows}/>
            </Paper>
        </Grid>
        </Container>
    );
}
