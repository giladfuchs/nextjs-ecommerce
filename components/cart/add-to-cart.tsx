"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Product } from "lib/shopify/types";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/cartSlice";

function SubmitButton({
                          availableForSale,
                          onClick,
                      }: {
    availableForSale: boolean;
    onClick: () => void;
}) {
    const buttonClasses =
        "relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white";
    const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

    if (!availableForSale) {
        return (
            <button disabled className={clsx(buttonClasses, disabledClasses)}>
                לא זמין במלאי
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            aria-label="הוסף לעגלה"
            className={clsx(buttonClasses, {
                "hover:opacity-90": true,
            })}
        >
            <div className="absolute left-0 ml-4">
                <PlusIcon className="h-5" />
            </div>
            הוסף לעגלה
        </button>
    );
}

export function AddToCart({ product }: { product: Product }) {
    const dispatch = useDispatch();

    // 🔥 useState for selected options instead of context



    const handleAddToCart = () => {
        dispatch(addItem({  product }));

        const openCartEvent = new CustomEvent('open-cart');
        window.dispatchEvent(openCartEvent);
    };

    return (
        <SubmitButton
            availableForSale={product.availableForSale}
            onClick={handleAddToCart}
        />
    );
}
