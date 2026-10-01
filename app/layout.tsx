import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DayShelf — Your private daily archive",
  description: "A calm, private place for your days, thoughts, plans and memories.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
