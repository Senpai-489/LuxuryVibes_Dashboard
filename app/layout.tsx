
'use client'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { CookiesProvider } from "react-cookie";
import Load from "./Components/ui/Load";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "DashBoard - Luxury Vibes Stay",
//   description: "Luxury Vibes Stay Sales Dashboard",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Load timeout={500} />
        <AuthProvider>
          <CookiesProvider>
            {children}
          </CookiesProvider>
        </AuthProvider>
        
      </body>
    </html>
  );
}
