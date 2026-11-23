## Descrição 

O achaê corresponde a um aplicativo mobile, desenvolvido para usuários consultarem e visualizarem as principais informações (nome, serviço ofertado, categoria do serviço e localização) dos profissionais cadastrados por categoria de serviço ofertado. 

### A aplicação possibilita o seguinte:

- os usuários visitantes encontrarem profissionais especializados em serviços dos quais necessitam;
- os usuários profissionais serem procurados para prestarem trabalho na área em que são cadastrados;
- os usuários administradores cadastrarem e gerenciarem os profissionais cadastrados;

### Informações Técnicas

A aplicação é desenvolvida em React Native com Typescript. Os dados são armazenados localmente no dispositivo utilizando o banco de dados local com a funcionalidade AsyncStorage do React Native. 


### Documentação Detalhada

[Documentacao.pdf](https://github.com/user-attachments/files/34015045/Documentacao.pdf)

### Vídeo Instrucional

https://github.com/user-attachments/assets/86398825-75d3-49c6-b75f-22cc56fcf09c

### Execução do Projeto

#### Configuração da API

Configure a URL pública do backend em um arquivo `.env` do frontend:

```text
EXPO_PUBLIC_API_URL=http://<HOST_OU_IP_DA_REDE>:3000/api
```

O valor deve incluir protocolo, host, porta e o prefixo `/api` do backend.
Exemplos:

- Emulador Android: `http://10.0.2.2:3000/api`
- Dispositivo físico: `http://IP_DA_MAQUINA_NA_REDE_LOCAL:3000/api`
- Web local: `http://localhost:3000/api`

Não informe credenciais ou dados sensíveis em `EXPO_PUBLIC_API_URL`.

Para executar o projeto com sucesso, siga as seguintes instruções em ordem:

1. Clone o projeto;

```
git clone https://github.com/arcanjo-devbr/Achae.git
```
   
2. Entre na pasta Achaê;
```
cd Achae
```

3. Instale a versão 9 do pnpm globalmente;

```
npm i -g pnpm@9
```

4. Instale as dependências [com pnpm]

```
pnpm install
```
5. Execute o projeto
```
npm start
```


### Como Contribuir
Mantemos um fluxo de trabalho rigoroso para garantir a qualidade do código e do histórico.

#### 1. Convenção de Branches
Siga o padrão: `tipo/numero-issue-descricao-curta`.
* `feat/`: Novas funcionalidades.
* `fix/`: Correção de bugs.
* `chore/`: Pequenas alterações de manutenção.
* `refactor/`: Refatoração de código sem adicionar funcionalidades ou corrigir bugs.
* `style/`: Mudanças de formatação (lint, espaços, indentação, etc.).
* `docs/`: Modificação na documentação (exemplo: README).
* `test/`: Modificações ou adição de testes.
* `perf/`: Melhorias de desempenho.
* `build/`: Mudanças na build e dependências, sem afetar o código.
* `revert/`: Reversão de um commit anterior.
* `cleanup/`: Remoção de códigos comentados ou trechos desnecessários.
* `remove/`: Exclusão de arquivos, diretórios ou funcionalidades obsoletas.
  
#### 2. Pull Requests (PRs)
- PRs para as branches `main` e `dev` exigem aprovação e não permitem *force push*.

