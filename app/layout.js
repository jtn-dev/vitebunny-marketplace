import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "./providers/WalletProvider";
import DatabaseProvider from "./providers/DatabaseProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FeedbackBar from "./components/FeedbackBar";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vite Bunny | NFT Marketplace",
  description: "A modern NFT marketplace to browse, buy, sell and mint NFTs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          <Navbar />
          {children}
          <FeedbackBar />
          <Footer />
          <DatabaseProvider />
          <Toaster position="bottom-right" />
        </WalletProvider>
      </body>
    </html>
  );
}
