"use client";

import Image from "next/image";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

export default function CheckoutPage() {
  const cart = useSelector((state: RootState) => state.cart);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="w-full md:w-1/2 p-6 md:p-12">
        <h2 className="text-xl font-bold mb-6 text-[var(--color-text-strong)]">
          Contact
        </h2>
        <input
          type="text"
          placeholder="Email"
          className="w-full p-4 rounded border border-[var(--color-border)] bg-transparent mb-4"
        />
        <input
          type="number"
          placeholder="Phone"
          className="w-full p-4 rounded border border-[var(--color-border)] bg-transparent mb-4"
        />
        <input
          type="text"
          placeholder="First name"
          className="w-full p-4 rounded border border-[var(--color-border)] bg-transparent mb-4"
        />
        <input
          type="text"
          placeholder="Last name"
          className="w-full p-4 rounded border border-[var(--color-border)] bg-transparent mb-4"
        />

        <button className="mt-8 bg-[var(--color-accent)] rounded text-white py-3 px-6 w-full">
          Continue to shipping
        </button>
      </div>

      <div className="w-full md:w-1/2 p-6 md:p-12 bg-[var(--color-bg-dark)] text-[var(--color-text-strong)]">
        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
        {cart?.lines.length ? (
          <ul>
            {cart.lines.map((item) => (
              <li key={item.id} className="flex items-center mb-4">
                <Image
                  src={item.merchandise.product.featuredImage.url}
                  alt={item.merchandise.product.title}
                  width={60}
                  height={60}
                  className="rounded border border-[var(--color-border)]"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-sm md:text-base">
                    {item.merchandise.product.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[var(--color-text)]">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="font-semibold text-sm md:text-base">
                  {item.cost.totalAmount.amount}{" "}
                  {item.cost.totalAmount.currencyCode}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your cart is empty.</p>
        )}

        <div className="border-t border-[var(--color-border)] pt-4 mt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>
              {cart?.cost.totalAmount.amount}{" "}
              {cart?.cost.totalAmount.currencyCode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
