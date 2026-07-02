'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { register } from '@/lib/api';
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

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas precisam ser iguais');
      return;
    }

    setLoading(true);

    try {
      const { access_token } = await register(email, password);
      login(access_token);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível cadastrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-180px)] max-w-6xl items-center px-4 py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[1fr_420px]">
        <section className="space-y-4 border border-border/70 bg-card p-8">
          <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            Cadastro
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Crie uma conta para testar carrinho, checkout e pedidos.
          </h1>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            O cadastro já autentica o usuário para seguir direto para o catálogo e iniciar a jornada de compra.
          </p>
        </section>

        <Card className="border border-border/70 bg-card">
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>Use um email válido e senha com 8 caracteres ou mais</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Criando conta...' : 'Criar conta'}
              </Button>

              <p className="text-xs text-muted-foreground">
                Já possui conta?{' '}
                <Link href="/login" className="underline underline-offset-4">
                  Entrar
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
