import { ColDef } from "ag-grid-community";
import { Category, Order, Product } from "./entities";
import { ModelType } from "./enums";

export type AGTableModelType = Product | Category | Order;
export const columns_product: ColDef<Product>[] = [
  {
    field: "title",
    headerName: "כותרת",
    width: 130,
  },
  {
    field: "price",
    headerName: "מחיר",
    width: 90,
  },
  {
    field: "category",
    headerName: "קטגוריה",
    width: 130,
  },
  {
    field: "id",
    headerName: "צפה",
    cellRenderer: "ActionRender",
    width: 130,
  },
] as ColDef<Product>[];
export const columns_order: ColDef<Order>[] = [
  {
    field: "name",
    headerName: "שם",
    width: 122,
  },
  {
    field: "email",
    headerName: "אימייל",
    width: 222,
  },
  {
    field: "phone",
    headerName: "טלפון",
    width: 120,
  },
  {
    field: "totalQuantity",
    headerName: "כמות",
    width: 70,
  },
  {
    field: "cost",
    headerName: "סה״כ",
    width: 80,
  },
  {
    field: "items",
    headerName: "מוצרים",
    width: 220,
    autoHeight: true,

    cellRenderer: "OrderItemsRender",
  },
  {
    field: "status",
    headerName: "סטטוס",
    width: 100,
    cellRenderer: "OrderStatusRender",
  },
  {
    field: "id",
    headerName: "צפה",
    cellRenderer: "ActionRender",
    width: 100,
  },
] as ColDef<Order>[];

export const columns_category: ColDef<Category>[] = [
  {
    field: "title",
    headerName: "שם",
    width: 122,
  },

  {
    field: "position",
    headerName: "מיקום",
    width: 120,
  },

  {
    field: "id",
    headerName: "צפה",
    cellRenderer: "ActionRender",
    width: 100,
  },
] as ColDef<Category>[];
export const get_columns_by_title = (
  title: ModelType,
): ColDef<AGTableModelType>[] => {
  let columns;
  switch (title) {
    case ModelType.product:
      columns = [...columns_product];
      break;

    case ModelType.order:
      columns = [...columns_order];
      break;
    case ModelType.category:
      columns = [...columns_category];
      break;

    default:
      columns = [...columns_product];
  }

  return columns as ColDef<AGTableModelType>[];
};
