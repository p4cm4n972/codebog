import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

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
    default: "CODEBOG - Exercices algorithme gratuits | JavaScript & C",
    template: "%s | CODEBOG",
  },
  description: "Exercices algorithme gratuits en ligne. Plateforme française pour apprendre à coder avec des exos pratiques en JavaScript et C. Parcours gamifié, défis algorithmiques et progression par niveaux.",
  keywords: [
    "exercice algorithme gratuit",
    "exo algorithme",
    "algorithme gratuit",
    "exercices programmation",
    "apprendre à coder gratuit",
    "javascript exercices",
    "langage C exercices",
    "coding bootcamp gratuit",
    "défis algorithmiques",
    "leetcode français",
    "programmation débutant",
    "cours code gratuit"
  ],
  authors: [{ name: "ITMade Studio", url: "https://itmade.studio" }],
  creator: "ITMade Studio",
  publisher: "CODEBOG",
  metadataBase: new URL("https://codebog.itmade.fr"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://codebog.itmade.fr",
    siteName: "CODEBOG",
    title: "CODEBOG - Exercices algorithme gratuits | JavaScript & C",
    description: "Exercices algorithme gratuits en ligne. Plateforme française pour apprendre à coder avec des exos pratiques. Parcours gamifié et défis algorithmiques.",
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
    card: "summary_large_image",
    title: "CODEBOG - Exercices algorithme gratuits",
    description: "Exos algorithme gratuits en JavaScript et C. Parcours gamifié pour apprendre à coder.",
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
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} flex flex-col min-h-screen bg-[#0a0f0a]`}
      >
        <AuthProvider>
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
