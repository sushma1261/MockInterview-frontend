import { ThemeProvider } from "@/app/utils/ThemeContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SidebarLayout from "@/components/SidebarLayout";
import { AuthProvider } from "@/lib/AuthContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mock Interview App",
  description: "An app to help you practice interview questions.",
};

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
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <SidebarLayout>{children}</SidebarLayout>
            {process.env.NODE_ENV === "production" && <Footer />}
            {/* {process.env.NODE_ENV === "development" && <Footer />} */}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
