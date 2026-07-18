import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SousXChef — AI agents for restaurant kitchens",
  description:
    "Inventory photos, labor scheduling, WhatsApp staff chat, and demand forecasting—one kitchen brain so you stop living in your DMs.",
  openGraph: {
    title: "SousXChef — AI agents for restaurant kitchens",
    description:
      "Walk-in truth, smarter labor, and answers over SMS. Built for owners who live service.",
    url: "https://sousxchef.online",
    siteName: "SousXChef",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[var(--ink)] font-sans text-white antialiased">{children}</body>
    </html>
  );
}
