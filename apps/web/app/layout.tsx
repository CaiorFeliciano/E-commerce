import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {};

import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
