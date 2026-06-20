import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {};

import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={cn("font-mono", jetbrainsMono.variable)}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
