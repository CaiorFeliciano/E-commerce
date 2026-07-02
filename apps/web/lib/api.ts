const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  createdAt?: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productId: string;
  product: Product;
}

export interface Order {
  id: string;
  total: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED';
  createdAt: string;
  items: OrderItem[];
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit & { token?: string }) {
  const headers = new Headers(init?.headers);

  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (init?.token) {
    headers.set('Authorization', 'Bearer ' + init.token);
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  const raw = await response.text();
  const data = raw ? safeJsonParse(raw) : null;

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && 'message' in data
        ? Array.isArray(data.message)
          ? data.message[0]
          : String(data.message)
        : null) || 'Não foi possível concluir a operação';

    throw new ApiError(message, response.status);
  }

  return data as T;
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export { ApiError, BASE_URL };

export function getProducts(): Promise<Product[]> {
  return request<Product[]>('/products');
}

export function getProduct(id: string): Promise<Product> {
  return request<Product>(`/products/${id}`);
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function getCart(token: string): Promise<Cart> {
  return request<Cart>('/cart', { token });
}

export function addToCart(token: string, productId: string, quantity = 1) {
  return request<CartItem>('/cart/items', {
    method: 'POST',
    token,
    body: JSON.stringify({ productId, quantity }),
  });
}

export function updateCartItem(token: string, itemId: string, quantity: number) {
  return request<CartItem>(`/cart/items/${itemId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(token: string, itemId: string) {
  return request(`/cart/items/${itemId}`, {
    method: 'DELETE',
    token,
  });
}

export function clearCart(token: string) {
  return request('/cart', {
    method: 'DELETE',
    token,
  });
}

export function checkout(token: string) {
  return request<Order>('/orders', {
    method: 'POST',
    token,
  });
}

export function getOrders(token: string): Promise<Order[]> {
  return request<Order[]>('/orders', { token });
}

export function createProduct(token: string, payload: ProductPayload) {
  return request<Product>('/products', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export function updateProduct(token: string, id: string, payload: ProductPayload) {
  return request<Product>(`/products/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(token: string, id: string) {
  return request<Product>(`/products/${id}`, {
    method: 'DELETE',
    token,
  });
}
