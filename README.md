# Fio e Flor - Sistema de Gerenciamento de Vendas

Sistema completo para gerenciamento de vendas de produtos manufaturados da loja "Fio e Flor".

## 📋 Visão Geral

Este projeto visa facilitar o controle e gerenciamento das vendas de produtos artesanais, proporcionando uma interface intuitiva para cadastro de produtos, controle de estoque, registro de vendas e relatórios financeiros.

## 🏗️ Arquitetura do Sistema

### Frontend (Interface Web)

- **Tecnologia**: React.js com TypeScript
- **Estilização**: Tailwind CSS
- **Funcionalidades principais**:
  - Tela de acesso com senha (armazenada no localStorage)
  - Dashboard com visão geral das vendas
  - Cadastro e gerenciamento de produtos
  - Controle de estoque
  - Registro de vendas
  - Cadastro de clientes
  - Relatórios e gráficos de desempenho

### Backend (API REST)

- **Tecnologia**: Node.js com Express e TypeScript
- **Funcionalidades principais**:
  - API RESTful para todas as operações
  - Validação de dados
  - Gerenciamento de vendas, produtos, materiais, insumos e clientes
  - Geração de relatórios
  - Upload de imagens dos produtos

### Banco de Dados

- **Tecnologia**: SQLite (desenvolvimento)
- **Estrutura principal**:
  - Vendas (id, data, cliente, produto, valor_total)
  - Produtos (id, nome, descrição, preço, custo, imagens, materiais)
  - Materiais (id, nome, insumos)
  - Insumos (id, nome, estoque)
  - Clientes (id, nome, telefone, endereço)

## 🎯 Funcionalidades Planejadas

### Módulo de Produtos

- ✅ Cadastro de produtos com fotos
- ✅ Categorização de produtos
- ✅ Controle de estoque
- ✅ Registro de custo e preço de venda
- ✅ Cálculo automático de margem de lucro

### Módulo de Vendas

- ✅ Registro de vendas
- ✅ Histórico de vendas
- ✅ Vinculação com clientes

### Módulo de Clientes

- ✅ Cadastro de clientes
- ✅ Histórico de compras por cliente

### Módulo de Relatórios

- ✅ Vendas por período
- ✅ Produtos mais vendidos
- ✅ Análise de lucro
- ✅ Gráficos de desempenho
- ✅ Controle de entrada e saída

### Módulo de Materiais

- ⏳ Controle de materiais e insumos
- ⏳ Cálculo de custo de produção
- ⏳ Visualização do estoque

## 🚀 Estrutura do Projeto

```md
fio-e-flor-system/
├── frontend/                # Aplicação React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   ├── contexts/       # Contextos React
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utilitários
│   └── package.json
│
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── controllers/    # Controladores
│   │   ├── models/         # Modelos do banco
│   │   ├── routes/         # Rotas da API
│   │   ├── middlewares/    # Middlewares
│   │   ├── services/       # Lógica de negócio
│   │   └── config/         # Configurações
│   └── package.json
│
├── database/               # Scripts e migrations
│   ├── migrations/         # Migrations do banco
│   └── seeds/              # Dados iniciais
│
└── README.md
```

## 🔧 Tecnologias Utilizadas

- React.js 18+
- TypeScript
- Tailwind CSS
- React Router
- Axios
- React Query
- Chart.js (para gráficos)
- LocalStorage (para proteção por senha)

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Multer (upload de arquivos)

- PostgreSQL 15+

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 15+ instalado
- npm ou yarn

## 🌐 Endpoints da API (Planejados)

### Produtos

- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Buscar produto
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto

### Vendas

- `GET /api/sales` - Listar vendas
- `GET /api/sales/:id` - Buscar venda
- `POST /api/sales` - Criar venda
- `GET /api/sales/report` - Relatório de vendas

### Clientes

- `GET /api/customers` - Listar clientes
- `GET /api/customers/:id` - Buscar cliente
- `POST /api/customers` - Criar cliente
- `PUT /api/customers/:id` - Atualizar cliente

## 📝 Próximos Passos

1. [x] Criar README e definir arquitetura
2. [x] Configurar estrutura do backend
3. [x] Configurar banco de dados com Prisma (SQLite)
4. [x] Criar CRUD de produtos
5. [x] Criar CRUD de vendas
6. [x] Criar CRUD de clientes
7. [x] Configurar estrutura do frontend
8. [x] Implementar tela de acesso com senha
8. [ ] Implementar tela de acesso com senha
9. [ ] Implementar páginas principais
10. [ ] Implementar dashboard e relatórios
11. [ ] Testes e ajustes finais
12. [ ] Deploy

## 📄 Licença

Projeto privado - Todos os direitos reservados.

## 👥 Autor

Desenvolvido para a loja Fio e Flor.
