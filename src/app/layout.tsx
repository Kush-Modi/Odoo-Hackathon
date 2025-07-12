import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "ReWear - Clothing Exchange",
  description: "A platform for exchanging and selling pre-loved clothing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-[var(--background)]">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
