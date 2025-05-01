"use client";

import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import ActionRender from "./ActionRender";
import { AGTableModelType } from "./ag_table";
import OrderItemsRender from "./OrderItemsRender";

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
      }}
    />
  </div>
);

export default AGTable;
