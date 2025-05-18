"use client";

import { IntlProvider } from "react-intl";
import { ReactNode } from "react";
import { messages } from "../assets/i18n/messages";

export default function IntProvider({ children }: { children: ReactNode }) {
  return (
    <IntlProvider locale="he" messages={messages["he"]}>
      {children}
    </IntlProvider>
  );
}
