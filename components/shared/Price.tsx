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
} & React.ComponentProps<"p">) => {
  const locale = "he-IL";

  const formatOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency: currencyCode ?? "ILS",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };

  return (
    <span suppressHydrationWarning className={className}>
      {new Intl.NumberFormat(locale, formatOptions).format(amount)}
    </span>
  );
};

export default Price;
