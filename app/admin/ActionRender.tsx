'use client';

import { ICellRendererParams } from 'ag-grid-community';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { ModelType } from './form/form';

const ActionRender = ({ data }: ICellRendererParams) => {
  return (
      <>
        {data.position === undefined && (
            <a
                href={`${data.collection ? `/${ModelType.product}/${data.handle}` : `/admin/${ModelType.order}/${data.id}`}`}
                target="_blank"
                rel="noopener noreferrer"
            >
              <IconButton size="small" aria-label="view" color="inherit">
                <VisibilityIcon fontSize="inherit" />
              </IconButton>
            </a>
        )}
        {data.title && (
            <a
                href={`/admin/form/${data.collection ? ModelType.product : ModelType.collection}/${data.id}`}
                rel="noopener noreferrer"
            >
              <IconButton size="small" aria-label="edit" color="inherit">
                <EditIcon fontSize="inherit" />
              </IconButton>
            </a>
        )}
      </>
  );
};

export default ActionRender;