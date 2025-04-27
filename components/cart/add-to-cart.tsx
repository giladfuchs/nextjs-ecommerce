"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Product, ProductVariant } from "lib/shopify/types";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/cartSlice";
import { useState, useMemo } from "react";

function SubmitButton({
                          availableForSale,
                          selectedVariantId,
                          onClick,
                      }: {
    availableForSale: boolean;
    selectedVariantId: string | undefined;
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

    if (!selectedVariantId) {
        return (
            <button
                aria-label="Please select an option"
                disabled
                className={clsx(buttonClasses, disabledClasses)}
            >
                <div className="absolute left-0 ml-4">
                    <PlusIcon className="h-5" />
                </div>
                הוסף לעגלה
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
    const [selectedOptions] = useState<Record<string, string>>(() => {
        const initialOptions: Record<string, string> = {};
        for (const option of product.options) {
            const key = option.name.toLowerCase();
            initialOptions[key] = option.values[0] ?? "";
        }
        return initialOptions;
    });

    const selectedVariant = useMemo(() => {
        return product.variants.find((variant: ProductVariant) =>
            variant.selectedOptions.every((opt) => {
                const key = opt.name.toLowerCase();
                return selectedOptions[key] === opt.value;
            }),
        );
    }, [product, selectedOptions]);

    const defaultVariantId = product.variants.length === 1 ? product.variants[0]?.id : undefined;
    const selectedVariantId = selectedVariant?.id || defaultVariantId;
    const finalVariant = product.variants.find((variant) => variant.id === selectedVariantId);

    const handleAddToCart = () => {
        if (finalVariant) {
            dispatch(addItem({ variant: finalVariant, product }));

            const openCartEvent = new CustomEvent('open-cart');
            window.dispatchEvent(openCartEvent);
        }
    };

    return (
        <SubmitButton
            availableForSale={product.availableForSale}
            selectedVariantId={selectedVariantId}
            onClick={handleAddToCart}
        />
    );
}
