"use client";


import * as React from 'react';
import {use, useState} from 'react';

import {Container, Grid, Paper} from '@mui/material';
import {ModelType} from "../form/form";
import {getCollections, getOrders, getProducts} from "../../../lib/api";
import {AGTableModelType, get_columns_by_title} from "../ag_table";
import {ColDef} from "ag-grid-community";
import AGTable from "../AGTable";

export default function AdminPage({
                                      params,
                                  }: {
    params: Promise<{ model: ModelType }>;
}) {
    const {model} = use(params);
    const [rows, setRows] = useState<AGTableModelType[]>([]);
    console.log(model)
    const cols: ColDef<AGTableModelType>[] = get_columns_by_title(model);

    React.useEffect(() => {
        const init = async () => {
            const objs = model === ModelType.product ? await getProducts() : model === ModelType.order ? await getOrders() : await getCollections();
            setRows(objs)
        }

        init();
    }, [model]);
    return (
        <Container maxWidth={false} disableGutters sx={{px: 0}}>

            <Grid

            >
                <Paper sx={{width: '100%', mb: 2}}>
                    <AGTable cols={cols} rows={rows}/>
                </Paper>
            </Grid>
        </Container>
    );
}
