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

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "CIVO",
  description: "우리 주변의 소식을 가장 빠르게 보는 방법",
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
      <body className="max-w-[420px] w-full h-full min-h-screen mx-auto overflow-hidden flex flex-col min-h-screen">
      <div className="fixed inset-0 z-0"> <Navermap /> </div>
      <Header />
      <main className="relative z-10 overflow-y-auto flex-grow pointer-events-none">{children}</main>
      <Footer/>
      </body>
    </html>
  );
}
