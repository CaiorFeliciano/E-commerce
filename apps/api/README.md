# E-commerce API

API em NestJS para autenticação, catálogo, carrinho e pedidos.

## Requisitos
- Node.js 20+
- PostgreSQL

## Configuração
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Copie `/home/runner/work/E-commerce/E-commerce/apps/api/.env.example` para `.env`.
3. Ajuste `DATABASE_URL`, `JWT_SECRET`, `PORT` e `WEB_URL`.
4. Execute as migrations do Prisma.

## Scripts
- `npm run start:dev` — inicia a API em desenvolvimento
- `npm run build` — gera o build de produção
- `npm run lint` — executa ESLint
- `npm run test` — executa testes unitários
- `npm run test:e2e` — executa o teste HTTP básico

## Principais rotas
- `POST /auth/register`
- `POST /auth/login`
- `GET /products`
- `GET /products/:id`
- `POST /products` (admin)
- `PUT /products/:id` (admin)
- `DELETE /products/:id` (admin)
- `GET /cart`
- `POST /cart/items`
- `PUT /cart/items/:id`
- `DELETE /cart/items/:id`
- `DELETE /cart`
- `POST /orders`
- `GET /orders`
- `GET /orders/:id`
