import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "SARO TECH USA — Next-Generation Architectural Finishes",
    template: "%s | SARO TECH USA",
  },
  description:
    "Premium WPC siding, decking, and wall panels. Now open and available nationwide from Houston, TX. Serving contractors, developers, and wholesalers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
