"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FilterItem } from "./item";
import type { ListItem } from ".";

export default function FilterItemDropdown({ list }: { list: ListItem[] }) {
  const pathname = usePathname();
  const [active, setActive] = useState("");
  const [openSelect, setOpenSelect] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    list.forEach((listItem: ListItem) => {
      if ("path" in listItem && pathname === listItem.path) {
        setActive(listItem.title);
      }
    });
  }, [pathname, list]);

  return (
      <div className="relative w-full" ref={ref}>
        <div
            onClick={() => setOpenSelect(!openSelect)}
            className="flex w-full cursor-pointer items-center justify-between rounded-md border border-black/20 bg-white px-4 py-2 text-sm dark:border-white/30 dark:bg-neutral-800 dark:text-white"
        >
          <div>{active}</div>
          <ChevronDownIcon className="h-4 w-4" />
        </div>

        {openSelect && (
            <div
                onClick={() => setOpenSelect(false)}
                className="absolute left-0 top-12 z-40 w-full rounded-md bg-white dark:bg-neutral-800 p-2 shadow-lg"
            >
              {list.map((item: ListItem, i) => (
                  <FilterItem key={i} item={item} />
              ))}
            </div>
        )}
      </div>
  );
}
