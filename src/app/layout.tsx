import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "./(main)/_components/navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auth Starter",
  description: "Shalev Asor Github",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <div>
            <ModalProvider />
            <Toaster />
            {/* <Navbar /> */}
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
