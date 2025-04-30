'use client';

import {AgGridReact} from 'ag-grid-react';
import {ColDef} from 'ag-grid-community';
import ActionRender from './ActionRender';
import {AGTableModelType} from './ag_table';

const defaultColDef: ColDef = {
    resizable: true,
    filter: true,
    sortable: true
};

const AGTable = ({cols, rows}: { cols: ColDef<AGTableModelType>[]; rows: AGTableModelType[] }) => (
    <div className="ag-theme-alpine" style={{height: 600, width: '100%',  direction: 'rtl',  padding: 0, margin: 0}}>
        <AgGridReact<AGTableModelType>
            rowData={rows}
            columnDefs={cols}
            defaultColDef={defaultColDef}
            paginationPageSize={10}
            rowSelection="multiple"
            frameworkComponents={{
                ActionRender
            }}
        />
    </div>
);

export default AGTable;