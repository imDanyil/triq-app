import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";

const exo_2 = Exo_2({
  variable: "--font-exo-2",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "TRIQ | Платформа для розвитку мозку",
  description:
    "Онлайн-тренажери для розвитку когнітивних навичок, пам'яті та уваги",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${exo_2.variable} antialiased`}>{children}</body>
    </html>
  );
}
