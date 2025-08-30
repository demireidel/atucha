import { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
export const metadata = {
  title: "Visit Atucha — Guided Nuclear Tour",
  description: "Interactive 3D tour of Atucha II reactor and control room."
};
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
