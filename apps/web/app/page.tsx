import { CatalogClient } from '@/components/store/catalog-client';
import { getProducts } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default async function HomePage() {
  try {
    const products = await getProducts();
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    const averagePrice =
      products.length > 0
        ? products.reduce((sum, product) => sum + product.price, 0) / products.length
        : 0;

    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 md:py-10">
        <section className="grid gap-6 border border-border/70 bg-card p-6 md:grid-cols-[1.3fr_0.7fr] md:p-8">
          <div className="space-y-5">
            <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
              Catálogo em destaque
            </p>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                Um e-commerce de portfólio focado em experiência de compra e gestão.
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                Explore o catálogo, teste o carrinho, acompanhe pedidos e visualize
                uma base pronta para evoluir com autenticação e área administrativa.
              </p>
            </div>
          </div>

          <div className="grid gap-3 text-sm md:grid-cols-2 md:content-end">
            <div className="border border-border/70 bg-background p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Produtos
              </p>
              <p className="mt-2 text-2xl font-semibold">{products.length}</p>
            </div>
            <div className="border border-border/70 bg-background p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Estoque total
              </p>
              <p className="mt-2 text-2xl font-semibold">{totalStock}</p>
            </div>
            <div className="border border-border/70 bg-background p-4 md:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Ticket médio do catálogo
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {formatCurrency(averagePrice)}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
              Produtos
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">Explore o catálogo</h2>
          </div>
          <CatalogClient products={products} />
        </section>
      </div>
    );
  } catch {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Não foi possível carregar o catálogo agora. Verifique se a API está rodando em{' '}
          <code>http://localhost:3001</code> ou ajuste a variável{' '}
          <code>NEXT_PUBLIC_API_URL</code>.
        </div>
      </div>
    );
  }
}
