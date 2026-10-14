import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "Edu Portal", template: "%s | Edu Portal" },
  description: "Навчальний портал з онлайн-курсами",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}