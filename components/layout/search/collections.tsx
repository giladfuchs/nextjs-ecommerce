"use client";

import clsx from "clsx";
import {useSelector} from "react-redux";
import FilterList from "./filter";
import {Suspense} from "react";
import {RootState} from "../../../store";

const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded-sm";
const activeAndTitles = "bg-neutral-800 dark:bg-neutral-300";
const items = "bg-neutral-400 dark:bg-neutral-700";

function CollectionList() {
    const collections = useSelector((state: RootState) => state.general.collections);
    return <FilterList list={collections}/>;
}

export default function Collections() {
    return (
        <Suspense
            fallback={
                <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
                    <div className={clsx(skeleton, activeAndTitles)}/>
                    <div className={clsx(skeleton, activeAndTitles)}/>
                    <div className={clsx(skeleton, items)}/>
                    <div className={clsx(skeleton, items)}/>
                    <div className={clsx(skeleton, items)}/>
                    <div className={clsx(skeleton, items)}/>
                    <div className={clsx(skeleton, items)}/>
                    <div className={clsx(skeleton, items)}/>
                    <div className={clsx(skeleton, items)}/>
                    <div className={clsx(skeleton, items)}/>
                </div>
            }
        >
            <CollectionList/>
        </Suspense>
    );
}
