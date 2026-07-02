'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getOrders, type Order } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function OrdersPage() {
  const { token, isReady } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOrders() {
      if (!token) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const data = await getOrders(token);
        setOrders(data);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar os pedidos');
      } finally {
        setLoading(false);
      }
    }

    if (isReady) {
      void loadOrders();
    }
  }, [isReady, token]);

  if (!isReady || loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        Carregando pedidos...
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="space-y-4 border border-border/70 bg-card p-6 text-sm">
          <h1 className="text-2xl font-semibold">Faça login para ver seus pedidos</h1>
          <p className="text-muted-foreground">
            O histórico fica disponível para acompanhar o fluxo de checkout deste portfólio.
          </p>
          <Link href="/login">
            <Button>Ir para login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
          Pedidos
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Acompanhe o histórico de compras</h1>
      </div>

      {error ? (
        <div className="border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {orders.length === 0 ? (
        <div className="border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Você ainda não tem pedidos. Finalize uma compra para visualizar o histórico.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="space-y-4 border border-border/70 bg-card p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    Pedido #{order.id.slice(0, 8)}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">Status: {order.status}</h2>
                </div>

                <div className="text-sm text-muted-foreground md:text-right">
                  <p>{formatDate(order.createdAt)}</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {order.items.map((item) => (
                  <div key={item.id} className="border border-border/70 bg-background p-4 text-sm">
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
