import { ErrorHandlerProvider } from "@/app/utils/ErrorHandlerContext";
import { NotificationProvider } from "@/app/utils/NotificationContext";
import { RoleProvider } from "@/app/utils/RoleContext";
import { ThemeProvider } from "@/app/utils/ThemeContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import NotificationStrip from "@/components/NotificationStrip";
import SidebarLayout, { SidebarProvider } from "@/components/SidebarLayout";
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
          <RoleProvider>
            <ThemeProvider>
              <NotificationProvider>
                <ErrorHandlerProvider>
                  <SidebarProvider>
                    <Navbar />
                    <NotificationStrip />
                    <SidebarLayout>{children}</SidebarLayout>
                    {process.env.NODE_ENV === "production" && <Footer />}
                    {/* {process.env.NODE_ENV === "development" && <Footer />} */}
                  </SidebarProvider>
                </ErrorHandlerProvider>
              </NotificationProvider>
            </ThemeProvider>
          </RoleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
