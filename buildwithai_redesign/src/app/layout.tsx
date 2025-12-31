import type { Metadata } from "next";

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";



export const metadata: Metadata = {
  title: "Build With AI | Next-Gen AI Website Builder",
  description: "The most advanced AI Website Builder platform for businesses, agencies, and creators. Futuristic, easy, and powerful.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-inter bg-gradient-brand">
        <Header />
        <div className="pt-20 pb-16 min-h-screen">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
