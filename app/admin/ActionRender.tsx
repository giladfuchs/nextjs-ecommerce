"use client";

import { ICellRendererParams } from "ag-grid-community";
import { IconButton } from "@mui/material";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { ModelType } from "./form/form";

const ActionRender = ({ data }: ICellRendererParams) => {
  return (
    <>
      {data.position === undefined && (
        <a
          href={`${data.collection ? `/${ModelType.product}/${data.handle}` : `/${ModelType.order}/${data.id}`}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconButton size="small" aria-label="view" color="inherit">
            <EyeIcon className="h-4 w-4" />
          </IconButton>
        </a>
      )}
      {data.title && (
        <a
          href={`/admin/form/${data.collection ? ModelType.product : ModelType.collection}/${data.id}`}
          rel="noopener noreferrer"
        >
          <IconButton size="small" aria-label="view" color="inherit">
            <PencilIcon className="h-4 w-4" />
          </IconButton>
        </a>
      )}
    </>
  );
};

export default ActionRender;
