import {ColDef} from 'ag-grid-community';
import {ModelType} from "../form/form";
import {Product} from "../../lib/types";

export type AGTableModelType = Product;
export const columns_product: ColDef<Product>[] = [
    {
        "field": "id",
        "headerName": "צפה",
        "cellRenderer": "ActionRender",
        "width": 100
    },
    {
        "field": "imageUrl",
        "headerName": "תמונה"
    },
    {
        "field": "collection",
        "headerName": "קטגוריה"
    },
    {
        "field": "price",
        "headerName": "מחיר"
    },
    {
        "field": "title",
        "headerName": "כותרת"
    }
]as ColDef<Product>[];

export const get_columns_by_title = (title: ModelType): ColDef<AGTableModelType>[] => {
    let columns = [];
    switch (title) {
        case ModelType.product:
            columns = [...columns_product];
            break;

        default:
            columns = [...columns_product];
    }
    // console.log(columns)
    return columns as ColDef<AGTableModelType>[];
};
