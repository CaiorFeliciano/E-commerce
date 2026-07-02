# E-commerce Portfolio

Monorepo com front-end e back-end de um e-commerce usado como projeto de portfólio.

## Estrutura
- `apps/web` — aplicação Next.js
- `apps/api` — API NestJS + Prisma

## O que já está implementado
- autenticação com JWT
- catálogo com listagem, busca, ordenação e detalhe do produto
- carrinho por usuário
- checkout com validação de estoque
- histórico de pedidos
- CRUD administrativo de produtos

## Como rodar
### API
```bash
cd apps/api
npm install
cp .env.example .env
npm run start:dev
```

### Web
```bash
cd apps/web
npm install
printf 'NEXT_PUBLIC_API_URL=http://localhost:3001\n' > .env.local
npm run dev
```

## Próximos passos sugeridos
- adicionar dashboard administrativo
- implementar upload real de imagens
- adicionar paginação e favoritos
- ampliar cobertura de testes end-to-end
