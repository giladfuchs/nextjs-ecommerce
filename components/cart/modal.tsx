"use client";

import { Dialog, Transition } from "@headlessui/react";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Price from "components/price";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { updateItem } from "../../store/cartSlice";

export default function CartModal() {
    const router = useRouter();
    const dispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart);

    const optimisticUpdate = (productId: string, updateType: "plus" | "minus" | "delete") => {
        dispatch(updateItem({ productId, updateType }));
    };
    const [isOpen, setIsOpen] = useState(false);
    const quantityRef = useRef(cart?.totalQuantity);

    useEffect(() => {
        if (cart?.totalQuantity && cart.totalQuantity !== quantityRef.current && cart.totalQuantity > 0) {
            if (!isOpen) setIsOpen(true);
            quantityRef.current = cart.totalQuantity;
        }
    }, [cart?.totalQuantity, isOpen]);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);
    const redirectToCheckout = () => {
        closeCart();
        router.push("/checkout");
    };
    return (
        <>
            <button aria-label="Open cart" onClick={openCart}>
                <OpenCart quantity={cart?.totalQuantity} />
            </button>

            <Transition show={isOpen}>
                <Dialog onClose={closeCart} className="relative z-50">
                    <Transition.Child
                        as={Fragment}
                        enter="transition-all ease-in-out duration-300"
                        enterFrom="opacity-0 backdrop-blur-none"
                        enterTo="opacity-100 backdrop-blur-[.5px]"
                        leave="transition-all ease-in-out duration-200"
                        leaveFrom="opacity-100 backdrop-blur-[.5px]"
                        leaveTo="opacity-0 backdrop-blur-none"
                    >
                        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="transition-all ease-in-out duration-300"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition-all ease-in-out duration-200"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <Dialog.Panel className="fixed bottom-0 left-0 top-0 flex h-full w-full flex-col border-r border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl md:w-[390px] dark:border-neutral-700 dark:bg-black/80 dark:text-white">
                            <div className="flex flex-1 flex-col">
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-semibold">עגלה</p>
                                    <button aria-label="Close cart" onClick={closeCart}>
                                        <CloseCart />
                                    </button>
                                </div>

                                {cart?.lines.length === 0 ? (
                                    <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                                        <ShoppingCartIcon className="h-16" />
                                        <p className="mt-6 text-center text-2xl font-bold">העגלה ריקה.</p>
                                    </div>
                                ) : (
                                    <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                                        <ul className="grow overflow-auto py-4">
                                            {[...cart.lines]
                                                .filter((item) => item?.title)
                                                .sort((a, b) => a.title.localeCompare(b.title))
                                                .map((item, i) => (
                                                    <li key={i} className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700">
                                                        <div className="relative flex w-full justify-between px-1 py-4">
                                                            <div className="absolute z-40 -ml-1 -mt-2">
                                                                <DeleteItemButton item={item} optimisticUpdate={optimisticUpdate} />
                                                            </div>

                                                            <div className="flex flex-row items-center gap-4">
                                                                <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900">
                                                                    <Image
                                                                        className="h-full w-full object-cover"
                                                                        width={64}
                                                                        height={64}
                                                                        alt={item.imageAlt || item.title}
                                                                        src={item.imageUrl}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-col justify-between h-16">
                                                                    <Link
                                                                        href={`/product/${item.handle}`}
                                                                        onClick={closeCart}
                                                                        className="text-base leading-tight"
                                                                    >
                                                                        {item.title}
                                                                    </Link>
                                                                    <Price
                                                                        className="text-xs text-neutral-500 dark:text-neutral-400"
                                                                        amount={item.unitAmount}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="flex h-16 flex-col justify-between">
                                                                <Price
                                                                    className="flex justify-end text-right text-sm"
                                                                    amount={item.totalAmount}
                                                                />
                                                                <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                                                                    <EditItemQuantityButton item={item} type="minus" optimisticUpdate={optimisticUpdate} />
                                                                    <p className="w-6 text-center">
                                                                        <span className="text-sm">{item.quantity}</span>
                                                                    </p>
                                                                    <EditItemQuantityButton item={item} type="plus" optimisticUpdate={optimisticUpdate} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>


                                        <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                                            <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                                                <p>לתשלום</p>
                                                <Price
                                                    className="text-right text-base text-black dark:text-white"
                                                    amount={cart.cost}
                                                />
                                            </div>
                                        </div>

                                        <CheckoutButton onClick={redirectToCheckout} />
                                    </div>
                                )}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition>
        </>
    );
}

function CloseCart() {
    return (
        <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
            <XMarkIcon className="h-6 transition-all ease-in-out hover:scale-110" />
        </div>
    );
}

function CheckoutButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            className="block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100"
            type="button"
            onClick={onClick}
        >
            רכישה
        </button>
    );
}
