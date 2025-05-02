'use client';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import clsx from 'clsx';
import type { CartItem } from 'lib/types';

function SubmitButton({ type }: { type: 'plus' | 'minus' }) {
    return (
        <span
            className={clsx(
                'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
                {
                    'ml-auto': type === 'minus',
                },
            )}
        >
      {type === 'plus' ? (
          <AddIcon fontSize="inherit" className="dark:text-neutral-500" />
      ) : (
          <RemoveIcon fontSize="inherit" className="dark:text-neutral-500" />
      )}
    </span>
    );
}

export function EditItemQuantityButton({
                                           item,
                                           type,
                                           optimisticUpdate,
                                       }: {
    item: CartItem;
    type: 'plus' | 'minus';
    optimisticUpdate: (id: string, type: 'plus' | 'minus') => void;
}) {
    const handleClick = () => {
        optimisticUpdate(item.productId, type);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={
                type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'
            }
        >
            <SubmitButton type={type} />
        </button>
    );
}