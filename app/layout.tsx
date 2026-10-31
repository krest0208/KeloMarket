import type { Metadata } from "next";
import "./globals.css";
import "./kelo-gallery.css";
import "./board-model.css";
import "./photo-gallery.css";
import "./motion-interactions.css";
import { StoreProvider, Header, Footer } from "@/components/storefront";

export const metadata: Metadata = {
  title: "KELO WOOD MARKET — дерево с характером",
  description: "Уникальные слэбы карельской сосны Кело, полки и заготовки в ваш размер. У дерева есть характер. Мы его сохраняем.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body><StoreProvider><a className="skip-link" href="#main">К содержимому</a><Header />{children}<Footer /></StoreProvider></body>
    </html>
  );
}
