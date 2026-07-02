'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type Product,
  type ProductPayload,
} from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const initialForm: ProductPayload = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  imageUrl: '',
};

export default function AdminProductsPage() {
  const { token, user, isReady } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductPayload>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const isAdmin = user?.role === 'ADMIN';

  async function loadProducts() {
    setLoading(true);

    try {
      const data = await getProducts();
      setProducts(data);
      setMessage('');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Não foi possível carregar produtos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  const submitLabel = useMemo(
    () => (editingId ? 'Salvar alterações' : 'Cadastrar produto'),
    [editingId],
  );

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || '',
    });
    setMessage('');
  }

  function resetForm() {
    setEditingId(null);
    setForm(initialForm);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!token) {
      setMessage('Faça login com um usuário administrador');
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await updateProduct(token, editingId, form);
        setMessage('Produto atualizado com sucesso');
      } else {
        await createProduct(token, form);
        setMessage('Produto criado com sucesso');
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Não foi possível salvar o produto');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!token) {
      setMessage('Faça login com um usuário administrador');
      return;
    }

    try {
      await deleteProduct(token, id);
      if (editingId === id) {
        resetForm();
      }
      setMessage('Produto removido com sucesso');
      await loadProducts();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Não foi possível remover o produto');
    }
  }

  if (!isReady) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        Carregando painel...
      </div>
    );
  }

  if (!token || !isAdmin) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="border border-border/70 bg-card p-6 text-sm">
          <h1 className="text-2xl font-semibold">Acesso restrito</h1>
          <p className="mt-2 text-muted-foreground">
            Esta área exige um usuário com perfil administrador para gerenciar o catálogo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[380px_1fr]">
      <Card className="h-fit border border-border/70 bg-card">
        <CardHeader>
          <CardTitle>{editingId ? 'Editar produto' : 'Novo produto'}</CardTitle>
          <CardDescription>
            Cadastre itens com preço, estoque e imagem para alimentar o catálogo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, price: Number(event.target.value || 0) }))
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stock">Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, stock: Number(event.target.value || 0) }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="imageUrl">Imagem (URL)</Label>
              <Input
                id="imageUrl"
                type="url"
                value={form.imageUrl || ''}
                onChange={(event) =>
                  setForm((current) => ({ ...current, imageUrl: event.target.value }))
                }
              />
            </div>

            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

            <div className="flex gap-2">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? 'Salvando...' : submitLabel}
              </Button>
              {editingId ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            Painel administrativo
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Gerencie o catálogo</h1>
        </div>

        {loading ? (
          <div className="border border-border/70 bg-card p-6 text-sm text-muted-foreground">
            Carregando produtos...
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {products.map((product) => (
              <article key={product.id} className="space-y-4 border border-border/70 bg-card p-5">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <span className="border border-border px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {product.stock} em estoque
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-semibold">{formatCurrency(product.price)}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => void handleDelete(product.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
