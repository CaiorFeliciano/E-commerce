'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Catálogo' },
  { href: '/cart', label: 'Carrinho' },
  { href: '/orders', label: 'Pedidos' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isReady, isAuthenticated, user, logout } = useAuth();

  return (
    <header className="border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.35em]">
            Caio Store
          </Link>
          <p className="text-xs text-muted-foreground">
            Portfólio de e-commerce com catálogo, carrinho e gestão de produtos.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <nav className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em]">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'border border-transparent px-3 py-2 text-muted-foreground transition hover:border-border hover:text-foreground',
                  pathname === link.href && 'border-border text-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'ADMIN' ? (
              <Link
                href="/admin/products"
                className={cn(
                  'border border-transparent px-3 py-2 text-muted-foreground transition hover:border-border hover:text-foreground',
                  pathname.startsWith('/admin') && 'border-border text-foreground',
                )}
              >
                Admin
              </Link>
            ) : null}
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            {isReady && isAuthenticated ? (
              <>
                <span className="border border-border px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {user?.email}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button variant="outline" size="sm">
                    Criar conta
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm">Entrar</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
