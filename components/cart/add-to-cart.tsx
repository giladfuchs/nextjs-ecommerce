'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useProduct } from 'components/product/product-context';
import { Product, ProductVariant } from 'lib/shopify/types';
import { useCart } from './cart-context';

function SubmitButton({
                        availableForSale,
                        selectedVariantId,
                        onClick
                      }: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  onClick: () => void;
}) {
  const buttonClasses =
      'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

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
            'hover:opacity-90': true
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
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();

  const variant = variants.find((variant: ProductVariant) =>
      variant.selectedOptions.every(
          (option) => option.value === state[option.name.toLowerCase()]
      )
  );

  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find(
      (variant) => variant.id === selectedVariantId
  );

  return (
      <SubmitButton
          availableForSale={availableForSale}
          selectedVariantId={selectedVariantId}
          onClick={() => {
            if (finalVariant) {
              addCartItem(finalVariant, product);
            }
          }}
      />
  );
}
