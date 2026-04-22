# CreativeClip 3D-AI Fashion Hub

SaaS em Next.js para autenticação, geração de imagens de moda com IA (mock Replicate), upload de base e histórico de criações.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (`@supabase/supabase-js`)
- Mock de integração Replicate

## Setup local

1. Instale dependências:
   - `npm install`
2. Configure variáveis:
   - `cp .env.example .env.local`
   - preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` para auth real.
3. Rode em desenvolvimento:
   - `npm run dev`
4. Acesse:
   - `http://localhost:3000`

Sem variáveis do Supabase, o app entra em **modo demo** com persistência local.

## Rotas principais

- `/login`
- `/cadastro`
- `/dashboard`
- `/gerar`
- `/historico`

## Estrutura de pastas

- `app/` rotas e páginas do App Router
- `components/` componentes reutilizáveis por domínio
- `lib/` integrações, mocks e utilitários
- `types/` tipos TypeScript do domínio
