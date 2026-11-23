# Achaê - Backend

Backend da aplicação Achaê, desenvolvido como parte do Projeto 2 da disciplina de Programação para Dispositivos Móveis. A API é responsável pelo gerenciamento dos dados da aplicação, permitindo o cadastro e a consulta de usuários, profissionais, cidades, profissões e categorias profissionais, utilizando persistência em banco de dados relacional.

## Sobre o projeto

O backend do Achaê foi desenvolvido como uma evolução do Projeto 1, que utilizava persistência local por meio do AsyncStorage. Nesta etapa, a aplicação passa a utilizar uma API REST com persistência em banco de dados PostgreSQL, permitindo centralizar e gerenciar os dados dos usuários e seus vínculos profissionais.

O sistema utiliza uma arquitetura em camadas, buscando separar as responsabilidades da aplicação e facilitar sua manutenção, organização e evolução.

## Tecnologias utilizadas

- **TypeScript:** linguagem utilizada no desenvolvimento.
- **Node.js:** ambiente de execução.
- **Express:** framework para criação e gerenciamento da API HTTP.
- **TypeORM:** ORM utilizado para gerenciamento das entidades e operações de persistência.
- **PostgreSQL:** banco de dados relacional.
- **Zod:** biblioteca utilizada para validação dos dados recebidos pela API.
- **dotenv:** gerenciamento de variáveis de ambiente.
- **pnpm:** gerenciador de pacotes.

## Estrutura do projeto

```text
backend/
├── config/          # Configurações da aplicação, ambiente e banco de dados
├── controllers/     # Tratamento das requisições HTTP
├── dto/             # Data Transfer Objects
├── entities/        # Entidades e relacionamentos do banco de dados
├── exceptions/      # Exceções personalizadas
├── instances/       # Instâncias e dependências da aplicação
├── mapper/          # Conversão entre entidades e DTOs
├── repository/      # Acesso e persistência dos dados
├── routes/          # Definição e organização dos endpoints
├── server/          # Configuração da aplicação Express
├── services/        # Operações e regras de negócio
├── tests/           # Testes automatizados
├── .env.example     # Exemplo de configuração das variáveis de ambiente
├── index.ts         # Ponto de entrada da aplicação
├── package.json     # Dependências e scripts
└── tsconfig.json    # Configuração do TypeScript
```

## Arquitetura

O backend utiliza uma arquitetura em camadas, separando as responsabilidades de cada componente.

### Routes

Responsável pela definição e organização dos endpoints HTTP, encaminhando as requisições para os métodos correspondentes dos Controllers.

### Controllers

Responsáveis por receber as requisições HTTP, validar os dados de entrada quando necessário, acionar os Services e retornar as respostas ao cliente.

### Services

Responsáveis pela coordenação das operações e implementação das regras de negócio da aplicação.

### Repository

Responsável por abstrair o acesso aos dados e realizar operações de persistência utilizando o TypeORM.

### Entities

Representam as entidades do banco de dados e definem seus atributos e relacionamentos.

### DTOs

Definem os formatos dos dados utilizados nas requisições e respostas da API.

### Mapper

Responsável pela conversão e mapeamento entre Entities e DTOs.

### Exceptions

Contém exceções personalizadas utilizadas no tratamento de erros da aplicação.

## Modelo de dados

O backend possui as seguintes entidades:

### Usuario

Representa um usuário da aplicação.

- Identificador: UUID.
- Nome.
- Telefone.
- Cidade.
- Vínculos profissionais.

### Cidade

Representa uma cidade cadastrada no sistema.

- Identificador: inteiro.
- Nome.
- Usuários relacionados.

### Profissao

Representa uma profissão disponibilizada na aplicação.

- Identificador: inteiro.
- Nome.
- Especialidade.
- Categoria profissional.
- Vínculos com usuários.

### CategoriaProfissional

Representa uma categoria profissional.

- Identificador: inteiro.
- Nome.
- Categoria.
- Profissões relacionadas.

### UsuarioTrabalha

Representa o vínculo profissional de um usuário.

- Identificador: UUID.
- Status.
- Descrição.
- Usuário relacionado.
- Profissão relacionada.

### Relacionamentos

- Uma cidade pode estar relacionada a vários usuários.
- Um usuário pode possuir vários vínculos profissionais.
- Cada vínculo profissional está relacionado a um usuário e a uma profissão.
- Uma categoria profissional pode possuir várias profissões.
- Uma profissão pode estar relacionada a vários vínculos profissionais.

As entidades Cidade, Profissao e CategoriaProfissional são configuradas como entidades somente de leitura, impedindo operações de inserção, atualização e remoção por meio do mecanismo de Subscriber do TypeORM.

## Endpoints da API



### Saúde do sistema

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/health` | Verifica se a API está funcionando. |

### Usuários

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/usuarios` | Cadastra um usuário e seus vínculos profissionais. |
| GET | `/usuarios` | Busca todos os usuários cadastrados. |

### Cidades

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/cidades` | Busca todas as cidades disponíveis. |

### Profissões

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/profissoes?categoriaId=<id>` | Busca profissões pertencentes a uma categoria profissional. |

### Categorias profissionais

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/categorias-profissionais` | Busca todas as categorias profissionais disponíveis. |

## Cadastro de usuário

O endpoint de cadastro recebe os dados do usuário e seus vínculos profissionais.

### Endpoint

```http
POST /usuarios
```

### Exemplo de requisição

```json
{
  "nome": "João da Silva",
  "telefone": "83999999999",
  "cidade": 1,
  "trabalhos": [
    {
      "profissao": "Eletricista",
      "categoria": "Construção",
      "status": true,
      "descricao": "Instalações elétricas residenciais"
    }
  ]
}
```

### Validações

Os dados enviados são validados utilizando Zod.

Entre as validações realizadas estão:

- Nome obrigatório, com limite de 150 caracteres.
- Telefone contendo DDD e 10 ou 11 dígitos.
- Cidade representada por um identificador inteiro positivo.
- Pelo menos um vínculo profissional.
- Profissão e categoria obrigatórias.
- Status representado por um valor booleano.
- Descrição com limite de 500 caracteres.

Em caso de dados inválidos, a API retorna uma resposta HTTP `400` contendo a descrição dos erros encontrados.

## Configuração do ambiente

### Pré-requisitos

- Node.js.
- pnpm.
- PostgreSQL.
- Banco de dados configurado e acessível.

### Instalação

Na pasta do backend, execute:

```bash
pnpm install
```

### Variáveis de ambiente

Utilize o arquivo `.env.example` como referência para configurar as variáveis de ambiente necessárias.

Para desenvolvimento, crie o arquivo `.env.development` na raiz do backend.

Exemplo:

```env
PORT=4000
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_banco"
URL_BANCO_POOLED="postgresql://usuario:senha@localhost:5432/nome_banco"
```

Configure as credenciais e os endereços de acordo com o ambiente utilizado.

O backend utiliza a variável `DATABASE_URL` para estabelecer a conexão com o PostgreSQL.

## Como executar

### Desenvolvimento

```bash
pnpm dev
```

O servidor será iniciado utilizando o ambiente de desenvolvimento, com reinicialização automática durante alterações nos arquivos TypeScript.

A porta utilizada é definida pela variável de ambiente `PORT`.

### Produção

```bash
pnpm prod
```

Ou:

```bash
pnpm start
```

Em produção, as variáveis de ambiente devem ser disponibilizadas pelo ambiente de execução.

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Executa a aplicação em modo desenvolvimento. |
| `pnpm prod` | Executa a aplicação em modo produção. |
| `pnpm start` | Executa a aplicação em modo produção. |
| `pnpm test` | Executa os testes automatizados. |

## Testes

O backend possui testes automatizados para diferentes componentes da aplicação.

Os testes estão organizados na pasta `tests/` e contemplam:

- Controllers.
- DTOs.
- Entities.
- Repositories.

Para executar os testes:

```bash
pnpm test
```

## Integração com o frontend

O frontend do Achaê, desenvolvido utilizando React Native e Expo, deverá consumir os endpoints disponibilizados pelo backend por meio de requisições HTTP.

A URL base da API.

Em ambiente local, a URL de acesso dependerá do ambiente em que o frontend estiver sendo executado.

Para dispositivos físicos, será necessário utilizar o endereço IP da máquina que está executando o backend, considerando que ambos estejam conectados à mesma rede e que a porta utilizada esteja acessível.

A integração entre o frontend e o backend está em desenvolvimento.

## Licença

Projeto desenvolvido para fins acadêmicos no contexto da disciplina de Programação para Dispositivos Móveis.