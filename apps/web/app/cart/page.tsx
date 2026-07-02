'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import {
  checkout,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
  type Cart,
} from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const { token, isReady } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadCart = useCallback(async (showLoader = true) => {
    if (!token) {
      setCart(null);
      setLoading(false);
      return;
    }

    if (showLoader) {
      setLoading(true);
    }

    try {
      const data = await getCart(token);
      setCart(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar o carrinho');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isReady) return;

    const timeoutId = window.setTimeout(() => {
      void loadCart(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isReady, loadCart]);

  const total = useMemo(
    () =>
      cart?.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ) ?? 0,
    [cart],
  );

  async function handleQuantityChange(itemId: string, quantity: number) {
    if (!token) return;

    try {
      await updateCartItem(token, itemId, quantity);
      await loadCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar o item');
    }
  }

  async function handleRemove(itemId: string) {
    if (!token) return;

    try {
      await removeCartItem(token, itemId);
      await loadCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível remover o item');
    }
  }

  async function handleClearCart() {
    if (!token) return;

    try {
      await clearCart(token);
      await loadCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível limpar o carrinho');
    }
  }

  async function handleCheckout() {
    if (!token) return;

    setSubmitting(true);

    try {
      await checkout(token);
      router.push('/orders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível finalizar a compra');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isReady || loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        Carregando carrinho...
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="space-y-4 border border-border/70 bg-card p-6 text-sm">
          <h1 className="text-2xl font-semibold">Faça login para acessar o carrinho</h1>
          <p className="text-muted-foreground">
            O carrinho é associado ao usuário autenticado para manter pedidos e histórico organizados.
          </p>
          <Link href="/login">
            <Button>Ir para login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            Carrinho
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Revise os itens da compra</h1>
        </div>

        {error ? (
          <div className="border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {!cart || cart.items.length === 0 ? (
          <div className="border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Seu carrinho está vazio. Volte ao catálogo para adicionar produtos.
          </div>
        ) : (
          <div className="space-y-3">
            {cart.items.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 border border-border/70 bg-card p-4 md:grid-cols-[1fr_120px_140px] md:items-center"
              >
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold">{item.product.name}</h2>
                  <p className="text-xs text-muted-foreground">{item.product.description}</p>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    Quantidade
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={item.product.stock}
                    value={item.quantity}
                    onChange={(event) =>
                      void handleQuantityChange(item.id, Number(event.target.value || 1))
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
                  <p className="text-sm font-semibold">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => void handleRemove(item.id)}>
                    Remover
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <aside className="h-fit space-y-4 border border-border/70 bg-card p-5">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Resumo
          </p>
          <p className="text-3xl font-semibold">{formatCurrency(total)}</p>
          <p className="text-xs text-muted-foreground">
            Estoque e pedido são validados novamente no checkout.
          </p>
        </div>

        <div className="grid gap-2">
          <Button
            type="button"
            disabled={!cart || cart.items.length === 0 || submitting}
            onClick={() => void handleCheckout()}
          >
            {submitting ? 'Processando...' : 'Finalizar compra'}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!cart || cart.items.length === 0}
            onClick={() => void handleClearCart()}
          >
            Limpar carrinho
          </Button>
          <Link href="/" className="text-center text-xs text-muted-foreground underline-offset-4 hover:underline">
            Continuar comprando
          </Link>
        </div>
      </aside>
    </div>
  );
}
