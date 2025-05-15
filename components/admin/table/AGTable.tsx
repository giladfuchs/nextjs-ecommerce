"use client";

import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import ActionRender from "./ActionRender";
import { AGTableModelType } from "../../../lib/types";
import OrderItemsRender from "./OrderItemsRender";
import OrderStatusRender from "./OrderStatusRender";

const defaultColDef: ColDef = {
  resizable: true,
  filter: true,
  sortable: true,
};

const AGTable = ({
  cols,
  rows,
}: {
  cols: ColDef<AGTableModelType>[];
  rows: AGTableModelType[];
}) => (
  <div
    className="ag-theme-alpine"
    data-testid="ag-table"
    style={{ height: 600, width: "100%", overflowX: "hidden" }}
  >
    <AgGridReact<AGTableModelType>
      rowData={rows}
      columnDefs={cols}
      defaultColDef={defaultColDef}
      enableRtl
      rowHeight={30}
      frameworkComponents={{
        ActionRender,
        OrderItemsRender,
        OrderStatusRender,
      }}
    />
  </div>
);

export default AGTable;
