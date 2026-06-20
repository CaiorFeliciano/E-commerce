const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao buscar produtos");
  return res.json();
}

export async function login(
  email: string,
  password: string,
): Promise<{ access_token: string }> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Credenciais inválidas");
  }

  return res.json();
}
