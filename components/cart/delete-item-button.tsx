'use client';

import CloseIcon from '@mui/icons-material/Close';
import type { CartItem } from 'lib/types';

export function DeleteItemButton({
                                   item,
                                   optimisticUpdate,
                                 }: {
  item: CartItem;
  optimisticUpdate: (productId: string, updateType: 'delete') => void;
}) {
  const handleClick = () => {
    optimisticUpdate(item.productId, 'delete');
  };

  return (
      <button
          onClick={handleClick}
          aria-label="Remove cart item"
          className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
      >
        <CloseIcon
            fontSize="small"
            className="mx-[1px] text-white dark:text-black"
        />
      </button>
  );
}