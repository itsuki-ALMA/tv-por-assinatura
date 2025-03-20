# Sistema TV por Assinatura - ACME

Este é um projeto [Next.js](https://nextjs.org) inicializado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Introdução

Este projeto é um sistema de TV por assinatura que permite gerenciar clientes, planos, pacotes, serviços adicionais e assinaturas. Ele utiliza Next.js para o frontend e MUI para os componentes de interface do usuário.

## Estrutura do Projeto

- **Clientes**: Gerenciamento de clientes, incluindo cadastro e listagem.
- **Planos**: Gerenciamento de planos de assinatura.
- **Pacotes**: Gerenciamento de pacotes de assinatura que podem incluir vários serviços adicionais.
- **Serviços Adicionais**: Gerenciamento de serviços adicionais que podem ser incluídos nos pacotes.
- **Assinaturas**: Gerenciamento de assinaturas dos clientes, incluindo a seleção de planos e pacotes.
- **Pagamentos**: Geração de boletos e carnês para pagamento das assinaturas.

## Começando

Primeiro, execute o servidor de desenvolvimento:

bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev

Abra http://localhost:3000 no seu navegador para ver o resultado.

Você pode começar a editar a página modificando src/app/page.tsx. A página é atualizada automaticamente conforme você edita o arquivo.

## Funcionalidades

- **Clientes**

A página de clientes permite cadastrar novos clientes e listar os clientes existentes. O cadastro de clientes exige nome e idade, e a idade mínima é de 18 anos.

- **Planos**

A página de planos permite cadastrar novos planos de assinatura e listar os planos existentes. Cada plano possui um nome e um valor.

-**Pacotes**

A página de pacotes permite cadastrar novos pacotes de assinatura e listar os pacotes existentes. Cada pacote pode incluir vários serviços adicionais.

- **Serviços Adicionais**

A página de serviços adicionais permite cadastrar novos serviços adicionais e listar os serviços existentes. Cada serviço possui um nome e um valor.

- **Assinaturas**

A página de assinaturas permite gerenciar as assinaturas dos clientes, incluindo a seleção de planos e pacotes. Também é possível adicionar serviços extras às assinaturas.

- **Pagamentos**

A página de pagamentos permite gerar boletos e carnês para pagamento das assinaturas. Os boletos são gerados em formato PDF e incluem um código de barras.

## Saiba Mais

Para saber mais sobre Next.js, consulte os seguintes recursos:

Documentação do Next.js - saiba mais sobre os recursos e a API do Next.js.
Aprenda Next.js - um tutorial interativo de Next.js.
Você pode conferir o repositório do Next.js no GitHub - seu feedback e contribuições são bem-vindos!

## Deploy na Vercel

A maneira mais fácil de fazer o deploy do seu aplicativo Next.js é usar a Plataforma Vercel dos criadores do Next.js.

Confira nossa documentação de deploy do Next.js para mais detalhes.