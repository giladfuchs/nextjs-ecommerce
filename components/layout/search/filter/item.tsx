"use client";

import clsx from "clsx";
import type { ListItem, PathFilterItem } from ".";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function PathFilterItem({ item }: { item: PathFilterItem }) {
    const pathname = usePathname();
    const active = pathname === item.path;



    const DynamicTag = active ? "p" : Link;

    return (
        <li className="mt-2 flex">
            <DynamicTag
                href={item.path}
                className={clsx(
                    "w-full rounded-md p-2 text-center text-sm font-medium",
                    "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700",
                    "text-black dark:text-white",
                    {
                        "underline underline-offset-4": active,
                    }
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
