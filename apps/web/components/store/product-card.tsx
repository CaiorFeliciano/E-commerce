import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from '@/components/store/add-to-cart-button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Product } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;

  return (
    <Card className="h-full border border-border/70 bg-card/70">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Sem imagem
          </div>
        )}
        <span className="absolute left-3 top-3 border border-border bg-background px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {isOutOfStock ? 'Sem estoque' : `${product.stock} em estoque`}
        </span>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 pt-4">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-foreground">{product.name}</h2>
          <p className="line-clamp-3 text-xs text-muted-foreground">
            {product.description}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Preço
            </p>
            <p className="text-base font-semibold text-foreground">
              {formatCurrency(product.price)}
            </p>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="text-xs uppercase tracking-[0.2em] text-foreground underline-offset-4 hover:underline"
          >
            Ver detalhes
          </Link>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border/70">
        <AddToCartButton
          productId={product.id}
          disabled={isOutOfStock}
          fullWidth
        />
      </CardFooter>
    </Card>
  );
}
