"use client";

import Footer from "@/components/Footer";
import { store } from "@/redux/store";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Project Management System",
//   description: "A modern project management system",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </Provider>
      </body>
    </html>
  );
}
