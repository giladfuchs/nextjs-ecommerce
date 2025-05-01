import {ColDef} from 'ag-grid-community';
import {ModelType} from "../form/form";
import {Order, Product} from "../../lib/types";

export type AGTableModelType = Product;
export const columns_product: ColDef<Product>[] = [
    {
        "field": "title",
        "headerName": "כותרת",
        "width": 130
    },
    {
        "field": "price",
        "headerName": "מחיר",
        "width": 80
    },
    {
        "field": "collection",
        "headerName": "קטגוריה",
        "width": 130

    },
    {
        "field": "id",
        "headerName": "צפה",
        "cellRenderer": "ActionRender",
        "width": 80
    }
] as ColDef<Product>[];
export const columns_order: ColDef<Order>[] = [
    {
        field: 'name',
        headerName: 'שם',
        width: 122,
    },
    {
        field: 'email',
        headerName: 'אימייל',
        width: 222,
    },
    {
        field: 'phone',
        headerName: 'טלפון',
        width: 120,
    },
    {
        field: 'totalQuantity',
        headerName: 'כמות',
        width: 70,
    },
    {
        field: 'cost',
        headerName: 'סה״כ',
        width: 80,
    },
    {
        field: 'items',
        headerName: 'מוצרים',
        width: 220,
        autoHeight: true,

        cellRenderer: 'OrderItemsRender',
    },
    {
        field: 'id',
        headerName: 'צפה',
        cellRenderer: 'ActionRender',
        width: 80,
    },
]as ColDef<Order>[];
export const get_columns_by_title = (title: ModelType): ColDef<AGTableModelType>[] => {
    let columns = [];
    switch (title) {
        case ModelType.product:
            columns = [...columns_product];
            break;

        case ModelType.order:
            columns = [...columns_order];
            break;

        default:
            columns = [...columns_product];
    }

    return columns as ColDef<AGTableModelType>[];
};
