"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import type { CartItem } from "lib/types";

export function DeleteItemButton({
                                   item,
                                   optimisticUpdate,
                                 }: {
  item: CartItem;
  optimisticUpdate: any;
}) {
  const merchandiseId = item.merchandise.id;

  const handleClick = () => {
    optimisticUpdate(merchandiseId, "delete");
  };

  return (
      <button
          onClick={handleClick}
          aria-label="Remove cart item"
          className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
      >
        <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
      </button>
  );
}
