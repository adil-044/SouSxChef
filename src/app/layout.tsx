import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SousXChef",
  description: "The AI Brain for Your Restaurant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: '"Space Mono", monospace' }}>
        {children}
      </body>
    </html>
  );
}
