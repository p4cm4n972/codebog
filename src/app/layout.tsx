import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "CODEBOG - Apprends à coder en JavaScript et C",
    template: "%s | CODEBOG",
  },
  description: "Plateforme gratuite pour apprendre à coder. Parcours gamifié avec exercices pratiques en JavaScript et C, progression par niveaux et défis algorithmiques.",
  keywords: ["coding", "programmation", "javascript", "C", "apprendre à coder", "exercices", "algorithmes", "bootcamp", "gratuit", "français"],
  authors: [{ name: "ITMade Studio", url: "https://itmade.studio" }],
  creator: "ITMade Studio",
  publisher: "CODEBOG",
  metadataBase: new URL("https://codebog.dev"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://codebog.dev",
    siteName: "CODEBOG",
    title: "CODEBOG - Apprends à coder en JavaScript et C",
    description: "Plateforme gratuite pour apprendre à coder. Parcours gamifié avec exercices pratiques, progression par niveaux et défis algorithmiques.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "CODEBOG Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "CODEBOG - Apprends à coder",
    description: "Plateforme gratuite pour apprendre JavaScript et C avec un parcours gamifié.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} flex flex-col min-h-screen bg-[#0a0f0a]`}
      >
        <AuthProvider>
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
