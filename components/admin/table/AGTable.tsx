"use client";

import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { useIntl } from "react-intl";
import ActionRender from "./ActionRender";
import OrderItemsRender from "./OrderItemsRender";
import OrderStatusRender from "./OrderStatusRender";
import { AGTableModelType } from "../../../lib/types";
import { localeCache } from "../../../lib/api";

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
}) => {
  const intl = useIntl();

  const localizedCols: ColDef<AGTableModelType>[] = cols.map((col) => ({
    ...col,
    headerName: intl.formatMessage({ id: `table.headerName.${col.field}` }),
  }));

  return (
    <div
      className="ag-theme-alpine"
      data-testid="ag-table"
      style={{ height: 600, width: "100%", overflowX: "hidden" }}
    >
      <AgGridReact<AGTableModelType>
        rowData={rows}
        columnDefs={localizedCols}
        defaultColDef={defaultColDef}
        enableRtl={localeCache.isRtl()}
        rowHeight={30}
        frameworkComponents={{
          ActionRender,
          OrderItemsRender,
          OrderStatusRender,
        }}
      />
    </div>
  );
};

export default AGTable;
