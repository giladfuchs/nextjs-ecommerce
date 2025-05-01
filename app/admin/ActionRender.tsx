'use client';

import {ICellRendererParams} from 'ag-grid-community';
import {IconButton} from '@mui/material';
import {EyeIcon, PencilIcon} from '@heroicons/react/24/outline';

const ActionRender = ({data}: ICellRendererParams) => {

    return (
        <>
            <a
                href={`${data.collection ? `/product/${data.handle}`:`/order/${data.id}`}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <IconButton size="small" aria-label="view" color="inherit">
                    <EyeIcon className="h-4 w-4"/>
                </IconButton>
            </a>
            {data.collection && <a
                href={`/form/product/${data.id}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <IconButton size="small" aria-label="view" color="inherit">
                    <PencilIcon className="h-4 w-4"/>
                </IconButton>
            </a>}

        </>
    );
};

export default ActionRender;
