# Diretrizes do projeto azuz-erp

## Princípios de código
- **Sempre aplicar SOLID**:
  - **S** — cada classe/serviço/módulo tem uma única responsabilidade.
  - **O** — estender comportamento sem modificar código existente (abstrações, injeção de dependência do NestJS).
  - **L** — implementações devem ser substituíveis por suas abstrações sem quebrar contratos.
  - **I** — interfaces pequenas e específicas, em vez de interfaces genéricas grandes.
  - **D** — depender de abstrações (interfaces/tokens de injeção), não de implementações concretas.
- **Código legível**:
  - Nomes descritivos para variáveis, funções e classes; evitar abreviações obscuras.
  - Funções curtas, com um único propósito; evitar aninhamento profundo (usar early return).
  - Tipagem explícita em TypeScript; evitar `any`.
  - Comentários apenas onde o "porquê" não é óbvio.
  - Seguir o padrão e estilo do código ao redor.

## Banco de dados
- **Usar sempre o schema `dev`** do Supabase/Postgres.
  - `backend-atria/.env`: `DATABASE_URL` e `DIRECT_URL` com `schema=dev` e `SUPABASE_DB_SCHEMA="dev"`.
  - Nunca executar queries, migrations ou scripts contra o schema `public`.
  - Em SQL escrito à mão, qualificar as tabelas com `dev.` quando o search_path não for garantido.
- **Qualquer alteração em código SQL exige autorização prévia do usuário, SEM EXCEÇÕES.**
  - Inclui: arquivos `.sql`, migrations, schema Prisma, queries raw, RPCs/funções/triggers/policies do Supabase, seeds e scripts que alterem o banco.
  - Antes de alterar: mostrar exatamente o que será mudado e **aguardar a autorização explícita**. Não prosseguir sem ela, mesmo em modo automático.
