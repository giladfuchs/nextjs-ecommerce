import React from "react";

const Price = ({
  amount,
  className,
  currencyCode = "ILS",
}: {
  amount: number;
  className?: string;
  currencyCode?: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<"p">) => (
  <span suppressHydrationWarning={true} className={className}>
    {new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)}
  </span>
);

export default Price;
