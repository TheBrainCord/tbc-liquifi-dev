import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const BASE_URL = "https://liquifi.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "LiquiFi — Fix Your Credit. Fund Your Dreams.",
  description:
    "India's trusted loan marketplace and CIBIL credit repair platform. Get pre-approved loan offers or improve your CIBIL score in 90 days. Salaried & self-employed welcome.",
  keywords: [
    "personal loan",
    "home loan",
    "CIBIL score",
    "credit repair",
    "loan marketplace India",
    "instant loan approval",
    "CIBIL fix",
  ],
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "LiquiFi",
    title: "LiquiFi — Fix Your Credit. Fund Your Dreams.",
    description:
      "India's trusted loan marketplace and CIBIL credit repair platform.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "LiquiFi — Fix Your Credit. Fund Your Dreams.",
    description:
      "India's trusted loan marketplace and CIBIL credit repair platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
