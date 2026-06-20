"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav className="border-b px-4 py-3 flex items-center justify-between">
      <Link href="/" className="font-semibold">
        E-commerce
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <Link href="/cart">
          <Button variant="ghost" size="sm">
            Carrinho
          </Button>
        </Link>

        {token ? (
          <Button variant="outline" size="sm" onClick={logout}>
            Sair
          </Button>
        ) : (
          <Link href="/login">
            <Button size="sm">Entrar</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
