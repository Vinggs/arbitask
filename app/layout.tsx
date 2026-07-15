import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google"; // <-- Ganti font ke Space Grotesk
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/ThemeProvider"; // <-- Import Provider dari next-themes

// Inisialisasi Space Grotesk buat Neo-Brutalism
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Arbitask - Dashboard",
  description: "Financial Optimization & Offerwall Aggregator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Tambahin suppressHydrationWarning biar nggak error pas reload di Next.js
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* Terapin class dari spaceGrotesk ke body */}
      <body
        className={`${spaceGrotesk.variable} ${spaceGrotesk.className} font-body-md text-body-md antialiased min-h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
