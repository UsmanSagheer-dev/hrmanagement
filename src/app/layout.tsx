import type { Metadata } from "next";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

import NextAuthSessionProvider from "../../providers/NextAuthSessionProvider";
import ToastProvider from "../../providers/ToastProvider";
import { Providers } from "../../providers/StoreProvider";

import "@fontsource/lexend/400.css";
import "@fontsource/lexend/500.css";
import "@fontsource/lexend/700.css";

export const metadata: Metadata = {
  title: "Hr Management",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-lexend">
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ToastProvider />
        <Providers>
          <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
        </Providers>
      </body>
    </html>
  );
}
