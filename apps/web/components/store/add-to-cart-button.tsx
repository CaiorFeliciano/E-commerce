'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function AddToCartButton({
  productId,
  quantity = 1,
  disabled,
  fullWidth,
}: AddToCartButtonProps) {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleAddToCart() {
    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await addToCart(token, productId, quantity);
      setMessage('Produto adicionado ao carrinho');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível adicionar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      <Button
        type="button"
        onClick={handleAddToCart}
        disabled={disabled || loading}
        className={fullWidth ? 'w-full' : ''}
      >
        {loading ? 'Adicionando...' : 'Adicionar ao carrinho'}
      </Button>
      {message ? <p className="mt-2 text-[11px] text-muted-foreground">{message}</p> : null}
    </div>
  );
}
