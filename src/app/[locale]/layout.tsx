import type React from "react";
import { getLocales } from "gt-next/server";

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
