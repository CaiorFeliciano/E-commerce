# E-commerce Web

Front-end em Next.js para o catálogo, autenticação, carrinho, pedidos e painel administrativo.

## Configuração
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env.local` com:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Fluxos disponíveis
- catálogo com busca e ordenação
- detalhes de produto
- cadastro e login
- carrinho com atualização de quantidade
- checkout básico
- área de pedidos
- painel de produtos para administradores

## Scripts
- `npm run dev`
- `npm run build`
- `npm run lint`
