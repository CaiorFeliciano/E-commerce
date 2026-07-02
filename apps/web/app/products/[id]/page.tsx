import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/store/add-to-cart-button';
import { getProduct } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id).catch(() => null);

  if (!product) {
    notFound();
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-[1fr_420px] md:py-10">
      <div className="relative aspect-square overflow-hidden border border-border/70 bg-card">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sem imagem cadastrada
          </div>
        )}
      </div>

      <div className="space-y-6 border border-border/70 bg-card p-6">
        <div className="space-y-3">
          <Link
            href="/"
            className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground underline-offset-4 hover:underline"
          >
            Voltar ao catálogo
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="text-sm leading-6 text-muted-foreground">{product.description}</p>
        </div>

        <div className="grid gap-3 text-sm md:grid-cols-2">
          <div className="border border-border/70 bg-background p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Preço
            </p>
            <p className="mt-2 text-2xl font-semibold">{formatCurrency(product.price)}</p>
          </div>
          <div className="border border-border/70 bg-background p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Disponibilidade
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {isOutOfStock ? 'Sem estoque' : `${product.stock} unidades`}
            </p>
          </div>
        </div>

        <div className="border border-border/70 bg-background p-4 text-sm text-muted-foreground">
          Checkout simplificado com validação de estoque em tempo real e pedidos
          atrelados ao usuário autenticado.
        </div>

        <AddToCartButton productId={product.id} disabled={isOutOfStock} fullWidth />
      </div>
    </div>
  );
}
