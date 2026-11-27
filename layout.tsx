import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {title: "EDFE | Daily Sprint", description: "Atividades de Produtos e Sales Enablement", icons: {icon: "/bee-favicon.png", shortcut: "/bee-favicon.png", apple: "/bee-apple.png"}};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
