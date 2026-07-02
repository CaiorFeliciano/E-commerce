'use client';

import { useMemo, useState } from 'react';
import { ProductCard } from '@/components/store/product-card';
import { Input } from '@/components/ui/input';
import type { Product } from '@/lib/api';

interface CatalogClientProps {
  products: Product[];
}

export function CatalogClient({ products }: CatalogClientProps) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('recent');

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const result = products.filter((product) => {
      if (!normalizedQuery) return true;

      return [product.name, product.description]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });

    switch (sort) {
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...result].sort((a, b) => b.price - a.price);
      case 'stock':
        return [...result].sort((a, b) => b.stock - a.stock);
      default:
        return [...result].sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        });
    }
  }, [products, query, sort]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 border border-border/70 bg-card p-4 md:grid-cols-[1fr_220px]">
        <Input
          placeholder="Buscar por nome ou descrição"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="h-8 rounded-none border border-input bg-transparent px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
        >
          <option value="recent">Mais recentes</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
          <option value="stock">Maior estoque</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Nenhum produto encontrado para os filtros aplicados.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
