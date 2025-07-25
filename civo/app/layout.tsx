import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import Navermap from "@/components/home/navermap";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { icons } from "lucide-react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "CIVO",
  description: "우리 주변의 소식을 가장 빠르게 보는 방법",
  manifest: "/manifest.json",
  icon: '/favicon.png',
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
};


export const viewport = {
  themeColor: "#ffffff",
};


const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="max-w-screen h-screen w-screen mx-auto flex flex-col">
      <main className="relative z-10 mt-[92.65px] h-[100vh-181.65] flex-grow min-h-0">{children}</main>
      <Header />
      <Footer/>
      </body>
    </html>
  );
}
