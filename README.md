<p align="center">
  <img src="public/simplesvetlogo.png" alt="SimplesVet Logo" width="220" />
</p>

# SimplesVet Frontend

Interface web para gerenciamento de uma clínica veterinária, desenvolvida como projeto de aprendizado com foco em boas práticas de arquitetura frontend, experiência do usuário e integração com inteligência artificial generativa.

---

## Visão geral

A aplicação permite cadastrar e gerenciar tutores, pets e consultas veterinárias por meio de uma interface limpa e responsiva. Todo o consumo de dados é feito via API REST (Django + Django REST Framework), e a interface conta com um assistente virtual treinado para responder dúvidas sobre o contexto de clínicas veterinárias.

---

## Arquitetura

O projeto segue o modelo SPA (Single Page Application), onde toda a navegação acontece no lado do cliente sem recarregar a página. O servidor entrega um único arquivo HTML, e o JavaScript assume o controle a partir daí, renderizando as views de acordo com a rota acessada. Isso proporciona uma experiência de uso mais fluida e próxima de um aplicativo nativo.

A comunicação com o backend é feita exclusivamente por chamadas HTTP assíncronas, sem acoplamento entre as camadas de apresentação e de dados.

---

## Tecnologias utilizadas

**Vue 3**
Framework JavaScript progressivo para construção de interfaces. Utilizado com a Composition API e o padrão de componentes de arquivo único (SFC — Single File Components), que organiza template, lógica e estilos em um único arquivo `.vue`.

**Vite**
Ferramenta de build moderna que substitui o Webpack com um servidor de desenvolvimento extremamente rápido baseado em ES Modules nativos. O build de produção gera arquivos otimizados e compactados prontos para deploy.

**Vue Router**
Gerenciamento de rotas no lado do cliente. As rotas definidas (`/dashboard`, `/owners`, `/pets`, `/appointments`) são mapeadas para componentes Vue sem qualquer redirecionamento de servidor.

**Pinia**
Gerenciador de estado global da aplicação. Cada domínio (tutores, pets, consultas) possui sua própria store com ações para buscar, criar, atualizar e remover registros. O estado é reativo e compartilhado entre componentes de forma centralizada.

**Axios**
Cliente HTTP utilizado para todas as requisições à API. Configurado com base URL via variável de ambiente, suporte a JSON-LD para criação de recursos e JSON Merge Patch para atualizações parciais.

---

## Assistente virtual com IA generativa

A aplicação integra um assistente virtual flutuante alimentado por um modelo de linguagem de grande escala (LLM), acessível a qualquer momento pelo botão fixo no canto da tela.

**Hugging Face Inference API**
A Hugging Face é uma das principais plataformas de IA do mundo, que hospeda e disponibiliza milhares de modelos de machine learning de forma acessível via API. Neste projeto, ela é utilizada como provedor de inferência, ou seja, recebemos as respostas do modelo sem precisar hospedar nada localmente.

**Modelo utilizado: Meta-Llama-3-8B-Instruct**
O Llama 3 é um modelo de linguagem desenvolvido pela Meta (criadora do Facebook), lançado como open weights — o que significa que seus pesos podem ser utilizados livremente. A versão 8B (8 bilhões de parâmetros) equilibra qualidade de resposta com eficiência computacional. A variante Instruct foi ajustada para seguir instruções e manter conversas coerentes em formato de chat.

A integração segue o padrão OpenAI de API (`/v1/chat/completions`), com um system prompt que contextualiza o modelo como assistente de uma clínica veterinária. As últimas mensagens da conversa são enviadas a cada requisição para manter o contexto do diálogo.

A chave de acesso à API é armazenada em variável de ambiente (`VITE_HUGGINGFACE_API_KEY`) e nunca é exposta no repositório.

---

## Funcionalidades

- Tela de carregamento inicial com efeito typewriter exibindo curiosidades sobre pets
- Cadastro completo de tutores com validação de campos
- Cadastro de pets vinculados a tutores, com validação de data de nascimento
- Agendamento de consultas com seleção de pet, data e descrição
- Edição e exclusão de todos os registros com confirmação de ação
- Tratamento de erros de integridade referencial ao tentar excluir registros vinculados
- Assistente virtual flutuante integrado ao Llama 3 via Hugging Face
- Layout totalmente responsivo com menu lateral em gaveta no mobile

---

## Responsividade

O layout foi construído com CSS puro, sem frameworks como Bootstrap ou Tailwind. A responsividade é implementada via media queries, com breakpoints em 768px e 480px. No mobile, a sidebar se transforma em uma gaveta lateral animada acionada por um botão hambúrguer no cabeçalho, usando o padrão `provide/inject` do Vue para comunicação entre componentes de layout.

---

## Estrutura do projeto

```
src/
  assets/styles/     # Arquivos CSS separados por componente/view
  components/        # Componentes reutilizáveis (layout, dialogs, assistente)
  composables/       # Lógica reutilizável com Composition API
  router/            # Definição de rotas
  services/          # Camada de comunicação com a API (Axios)
  stores/            # Stores Pinia por domínio
  views/             # Páginas da aplicação
```

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz com base no `.env.example`:

```
VITE_API_URL=http://localhost:8000/api
VITE_HUGGINGFACE_API_KEY=sua_chave_aqui
```

---

## Como rodar localmente

```bash
npm install
npm run dev
```

O servidor de desenvolvimento estará disponível em `http://localhost:5173`.

---

## Backend

Este frontend consome uma API REST desenvolvida em Django com Django REST Framework e banco de dados PostgreSQL. O repositório do backend está disponível separadamente.
