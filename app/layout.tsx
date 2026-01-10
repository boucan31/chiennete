import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Loader from "./components/Loader";
import VisualEffects from "./components/VisualEffects";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LA CHIENNETÉ — DROP 001",
  description: "La première collection qui définit notre identité. Des pièces essentielles, un design intemporel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div id="main-content" className="transition-all duration-300 ease-in-out">
          <Loader />
          <VisualEffects />
          {children}
        </div>
      </body>
    </html>
  );
}
