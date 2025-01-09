import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/commonComponents/Sidebar";
import Navbar from "./components/commonComponents/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Note Master",
  description: "Note master is one stop solution for creating notes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black `}
      >
        <div className="flex">
          {/* Sidebar */}
          {/* <Sidebar /> */}

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="mt-16 p-4 ">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
