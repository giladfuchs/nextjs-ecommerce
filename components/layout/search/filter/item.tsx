"use client";

import clsx from "clsx";
import type { ListItem, PathFilterItem } from ".";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function PathFilterItem({ item }: { item: PathFilterItem }) {
  const pathname = usePathname();
  const active = pathname === item.path;

  if (!item.path) {
    // Optionally log or skip rendering
    console.warn("Missing path for filter item:", item);
    return null;
  }

  const DynamicTag = active ? "p" : Link;

  return (
    <li className="mt-2 flex text-theme dark:text-theme" key={item.title}>
      <DynamicTag
        href={item.path}
        className={clsx(
          "w-full text-sm underline-offset-4 hover:underline hover:text-accent dark:hover:text-accent",
          {
            "underline underline-offset-4": active,
          },
        )}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}
export function FilterItem({ item }: { item: ListItem }) {
  return <PathFilterItem item={item} />;
}
