import { getLocales } from "gt-next/server";
import type React from "react";

export function generateStaticParams() {
  return getLocales().map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
