# Espaço Cachos Aju — Front

Site e painel do salão Espaço Cachos Aju (Aracaju/SE), em Next.js (App Router) com React Compiler. Nasceu do front do BarberHub, sem o clube de assinatura e com estoque e comanda. A API fica em `/home/reverbo/studing/cachos-espaco-aju-backend` (NestJS).

## Comandos

- `npm run dev`: sobe em `http://localhost:3011`
- `npm run build` / `npm start`: build e produção (porta 3011)
- `npm run lint`, `npm run typecheck`, `npm run format:check`
- `npm test` / `npm run test:coverage` (Vitest + Testing Library)
- O CI (`.github/workflows/ci.yml`) roda lint, formatação, tipos, testes, Sass e build. Rode a mesma sequência antes de abrir PR.

## Integração com o back

- A API roda em `http://localhost:3010`. URL base, caminho do proxy e nomes dos cookies ficam só em `src/services/api/config.ts`.
- No browser, as chamadas vão para o proxy `/api/backend/*` (`src/app/api/backend/[...path]/route.ts`). No servidor, `src/services/api/server.ts` usa a URL absoluta.
- Token JWT no cookie httpOnly definido em `ACCESS_TOKEN_COOKIE`. Para ler a sessão no servidor, use `getAccessToken()` e `decodeTokenPayload()` de `src/services/api/session.ts`.
- `src/services/api/axios.ts` roda nos dois lados: lá o `next/headers` é importado dinamicamente, nunca via `session.ts`, senão a build com webpack quebra.

## Convenções

- **Hooks fora do `.tsx`**: componentes só chamam hooks customizados. Estado e efeitos vivem em `use-*.ts` (na pasta `hooks/` da área ou ao lado do componente). Hooks genéricos ficam em `src/hooks/`.
- **Lógica pura em `*.utils.ts`**, com teste ao lado (`*.test.ts`).
- **Zustand só para estado compartilhado entre componentes distantes**: `dashboard-modals.store.ts` (modais do dashboard) e `client-dashboard.store.ts` (dados da conta do cliente). Estado local continua em `useState`, dados do servidor continuam em Server Components ou na URL.
- **Sass com BEM**: `bloco__elemento--modificador`, em kebab-case. Estados também são modificadores (`--active`, `--selected`), nunca `is-*`. Modificador sempre acompanha a classe base. Para classes condicionais, use `cn()` de `src/utils/class-names.ts`.
- Ao renomear classes, mantenha a mesma estrutura de aninhamento no SCSS para não mudar a especificidade.
- Formatadores e helpers compartilhados: `src/utils/format.ts` (moeda, iniciais), `src/utils/phone.ts`, `src/utils/date-utils.ts`.
- Comentários só quando explicam um porquê que o código não mostra.
- Imagens remotas precisam estar em `remotePatterns` no `next.config.ts`.
- Se o dev server servir CSS antigo depois de editar partials Sass, pare o servidor e apague `.next/dev`.

## Site público (home e agendamento)

- Módulo `src/salon`: conteúdo em `salon.data.ts` (fotos, intenções de serviço, "Descubra seu cuidado", combinados, avaliações do Google), regras puras em `salon.utils.ts` (com teste), leituras no servidor em `salon.service.ts` e chamadas do agendamento em `salon.api.ts`.
- Páginas: `/` (home), `/agendar` (`?servico=` e `?profissional=` pré-selecionam) e `/profissionais/[id]` (redireciona para o agendamento com a profissional). `/servicos`, `/sobre`, `/contato` e `/profissionais` redirecionam para seções da home.
- Na home, o agendamento inteiro fica num card na hero (`<BookingFlow compact />`, âncora `#agendar`); o botão flutuante some enquanto o card está na tela. `/agendar` mostra o mesmo fluxo em página cheia.
- Depois de marcar, a cliente paga o sinal de 20% (Pix ou cartão pelo Asaas) em `DepositStep`; o hook `use-deposit` consulta o status a cada 4 s e mostra "Horário confirmado" quando o pagamento entra.
- O agendamento começa pelo serviço; com uma profissional só, o passo "Com quem?" some. Os horários vêm de `GET /slots?serviceId=`, que só devolve horários em que o serviço cabe.
- `salon.scss` é importado só nessas páginas (as classes `s-*` não podem coexistir com o CSS do painel). Por isso os links para `/login` usam `<a>`, com carga completa.
- Paleta das fotos do espaço novo: cacau, chocolate do logo, creme (sem branco puro), taupe, dourado e oliva. Formas orgânicas creme (`Shapes.tsx`) cortam as seções escuras.
- Fontes: Inter Tight (títulos), Bodoni Moda (logo e destaques em itálico) e Inter (texto).
- Fotos em `public/salao` (ver `LEIA-ME.md` lá), tiradas do post de inauguração no Instagram.
- O painel ainda usa a paleta `$brand-*` de `src/assets/sass/utilities/_variables.scss` e o logo de `src/components/brand/BrandLogo.tsx`.

## Estoque e comanda

- Telas em `src/features/stock` e `src/features/orders`, usadas no painel da dona (`?view=estoque`, `?view=comandas`) e no da profissional.
- Peças visuais compartilhadas (`panel-*`) em `src/app/dashboard/styles/_panel-kit.scss`; modal em `src/components/panel-dialog`.
- Concluir um atendimento leva para `?view=comandas&atendimento=<id>`, que abre (ou cria) a comanda já com o serviço.
- Pix pelo Asaas: o modal consulta o pagamento a cada 5 s (`POST /orders/:id/payments/:paymentId/refresh`), então funciona mesmo se o webhook atrasar.
- Comanda de agendamento com sinal mostra "Sinal pago no site" e "A receber"; o modal de pagamento cobra só `dueAmount`.
- O Financeiro lê as comandas pagas (`orderToPayment` em `owner.utils.ts`).
