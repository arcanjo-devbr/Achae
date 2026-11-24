import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { createServer } from "node:http";
import { CategoriaController } from "../controllers/CategoriaController";
import { CidadeController } from "../controllers/CidadeController";
import { ProfissaoController } from "../controllers/ProfissaoController";
import { UsuarioController } from "../controllers/UsuarioController";
import type {
  IUsuarioService,
} from "../services/IUsuarioService";
import type { ICategoriaService } from "../services/ICategoriaService";
import type { IProfissaoService } from "../services/IProfissaoService";
import type { ICidadeService } from "../services/ICidadeService";
import { HttpError } from "../exceptions/HttpError";
import { CategoriaProfissional } from "../entities/CategoriaProfissional";
import { Cidade } from "../entities/Cidade";
import { Profissao } from "../entities/Profissao";
import type { UsuarioRequestDTO, UsuarioResponseDTO } from "../dto";

async function comServidorHttp(
  aplicativo: express.Express,
  executar: (urlBase: string) => Promise<void>,
): Promise<void> {
  const servidor = createServer(aplicativo);
  await new Promise<void>((resolver, rejeitar) => {
    servidor.once("error", rejeitar);
    servidor.listen(0, "127.0.0.1", resolver);
  });

  const endereco = servidor.address();
  if (!endereco || typeof endereco === "string") {
    await new Promise<void>((resolver) => servidor.close(() => resolver()));
    throw new Error("O servidor de teste não forneceu um endereço.");
  }

  try {
    await executar(`http://127.0.0.1:${endereco.port}`);
  } finally {
    await new Promise<void>((resolver, rejeitar) => {
      servidor.close((erro) => (erro ? rejeitar(erro) : resolver()));
    });
  }
}

const usuarioResponse: UsuarioResponseDTO = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  nome: "Maria",
  telefone: "(83) 99999-9999",
  cidade: 1,
  trabalhos: [
    {
      id: "827f6f7a-f1d2-48bd-bba8-a4f008caf19b",
      profissao: "Eletricista",
      categoria: "Elétrica",
      status: true,
      descricao: "Instalações residenciais",
    },
  ],
};

test("UsuarioController valida e cria usuário com resposta 201", async () => {
  let dadosRecebidos: UsuarioRequestDTO | undefined;
  const usuarioService: IUsuarioService = {
    criarUsuario: async (dados) => {
      dadosRecebidos = dados;
      return usuarioResponse;
    },
    buscarUsuario: async () => [usuarioResponse],
  };
  const aplicativo = express();
  aplicativo.use(express.json());
  aplicativo.post("/", new UsuarioController(usuarioService).criarUsuario);

  await comServidorHttp(aplicativo, async (urlBase) => {
    const resposta = await fetch(urlBase, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        nome: " Maria ",
        telefone: "(83) 99999-9999",
        cidade: 1,
        trabalhos: [
          {
            profissao: " Eletricista ",
            categoria: " Elétrica ",
            status: true,
            descricao: " Instalações residenciais ",
          },
        ],
      }),
    });

    assert.equal(resposta.status, 201);
    assert.deepEqual(await resposta.json(), usuarioResponse);
    assert.deepEqual(dadosRecebidos, {
      nome: "Maria",
      telefone: "(83) 99999-9999",
      cidade: 1,
      trabalhos: [
        {
          profissao: "Eletricista",
          categoria: "Elétrica",
          status: true,
          descricao: "Instalações residenciais",
        },
      ],
    });
  });
});

test("UsuarioController rejeita dados inválidos sem chamar o Service", async () => {
  let serviceChamado = false;
  const usuarioService: IUsuarioService = {
    criarUsuario: async () => {
      serviceChamado = true;
      return usuarioResponse;
    },
    buscarUsuario: async () => [usuarioResponse],
  };
  const aplicativo = express();
  aplicativo.use(express.json());
  aplicativo.post("/", new UsuarioController(usuarioService).criarUsuario);

  await comServidorHttp(aplicativo, async (urlBase) => {
    const resposta = await fetch(urlBase, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        nome: "Maria",
        telefone: "telefone-invalido",
        cidade: 1,
        trabalhos: [],
      }),
    });
    const corpo = (await resposta.json()) as { mensagem: string; erros: unknown[] };

    assert.equal(resposta.status, 400);
    assert.equal(corpo.mensagem, "Dados de cadastro inválidos.");
    assert.ok(corpo.erros.length > 0);
    assert.equal(serviceChamado, false);
  });
});

test("UsuarioController converte HttpError em status e mensagem HTTP", async () => {
  const usuarioService: IUsuarioService = {
    criarUsuario: async () => {
      throw new HttpError(409, "Usuário já cadastrado.");
    },
    buscarUsuario: async () => [usuarioResponse],
  };
  const aplicativo = express();
  aplicativo.use(express.json());
  aplicativo.post("/", new UsuarioController(usuarioService).criarUsuario);

  await comServidorHttp(aplicativo, async (urlBase) => {
    const resposta = await fetch(urlBase, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        nome: "Maria",
        telefone: "83999999999",
        cidade: 1,
        trabalhos: [
          {
            profissao: "Eletricista",
            categoria: "Elétrica",
            status: true,
            descricao: "",
          },
        ],
      }),
    });

    assert.equal(resposta.status, 409);
    assert.deepEqual(await resposta.json(), {
      mensagem: "Usuário já cadastrado.",
    });
  });
});

test("Controllers de catálogos retornam DTOs sem expor entidades", async () => {
  const categoria = Object.assign(new CategoriaProfissional(), {
    identificador: 2,
    nome: "Serviços",
    categoria: "Geral",
  });
  const profissao = Object.assign(new Profissao(), {
    identificador: 3,
    nome: "Eletricista",
    especialidade: "Instalações",
  });
  const cidade = Object.assign(new Cidade(), {
    identificador: 1,
    nome: "Campina Grande",
  });
  let categoriaRecebida: number | undefined;

  const categoriaService: ICategoriaService = {
    buscarTodasCategorias: async () => [categoria],
  };
  const profissaoService: IProfissaoService = {
    buscarTodos: async () => [profissao],
    buscarPorCategoria: async (identificador) => {
      categoriaRecebida = identificador;
      return [profissao];
    },
  };
  const cidadeService: ICidadeService = {
    buscarTodasCidades: async () => [cidade],
  };
  const aplicativo = express();
  aplicativo.get(
    "/categorias",
    new CategoriaController(categoriaService).buscarCategorias,
  );
  aplicativo.get(
    "/profissoes",
    new ProfissaoController(profissaoService).buscarProfissoes,
  );
  aplicativo.get("/cidades", new CidadeController(cidadeService).buscarCidades);

  await comServidorHttp(aplicativo, async (urlBase) => {
    const categorias = await fetch(`${urlBase}/categorias`);
    assert.equal(categorias.status, 200);
    assert.deepEqual(await categorias.json(), [
      { id: 2, nome: "Serviços", categoria: "Geral" },
    ]);

    const profissoes = await fetch(
      `${urlBase}/profissoes?categoriaId=2`,
    );
    assert.equal(profissoes.status, 200);
    assert.deepEqual(await profissoes.json(), [
      {
        id: 3,
        nome: "Eletricista",
        especialidade: "Instalações",
        categoria_profissional: 2,
      },
    ]);
    assert.equal(categoriaRecebida, 2);

    const cidades = await fetch(`${urlBase}/cidades`);
    assert.equal(cidades.status, 200);
    assert.deepEqual(await cidades.json(), [
      { id: 1, nome: "Campina Grande" },
    ]);
  });
});

test("ProfissaoController valida o identificador da categoria", async () => {
  const profissaoService: IProfissaoService = {
    buscarTodos: async () => [],
    buscarPorCategoria: async () => {
      throw new Error("O Service não deve ser chamado.");
    },
  };
  const aplicativo = express();
  aplicativo.get(
    "/profissoes",
    new ProfissaoController(profissaoService).buscarProfissoes,
  );

  await comServidorHttp(aplicativo, async (urlBase) => {
    const resposta = await fetch(`${urlBase}/profissoes?categoriaId=abc`);
    assert.equal(resposta.status, 400);
    assert.deepEqual(await resposta.json(), {
      mensagem: "O parâmetro categoriaId deve ser um inteiro positivo.",
    });
  });
});

test("UsuarioController lista usuários com resposta 200", async () => {
  const usuarioService: IUsuarioService = {
    criarUsuario: async () => usuarioResponse,
    buscarUsuario: async () => [usuarioResponse],
  };
  const aplicativo = express();
  aplicativo.get("/", new UsuarioController(usuarioService).buscarUsuarios);

  await comServidorHttp(aplicativo, async (urlBase) => {
    const resposta = await fetch(urlBase);
    assert.equal(resposta.status, 200);
    assert.deepEqual(await resposta.json(), [usuarioResponse]);
  });
});

test("UsuarioController combina nome, categoria e profissão na busca", async () => {
  const filtrosRecebidos: unknown[] = [];
  const usuarioService: IUsuarioService = {
    criarUsuario: async () => usuarioResponse,
    buscarUsuario: async () => [],
    buscarUsuarioComFiltros: async (filtros) => {
      filtrosRecebidos.push(filtros);
      return [usuarioResponse];
    },
  };
  const aplicativo = express();
  aplicativo.get("/", new UsuarioController(usuarioService).buscarUsuarios);

  await comServidorHttp(aplicativo, async (urlBase) => {
    const resposta = await fetch(
      `${urlBase}/?busca=Maria&categorias=Elétrica,Hidráulica&profissao=Eletricista`,
    );

    assert.equal(resposta.status, 200);
    assert.deepEqual(await resposta.json(), [usuarioResponse]);
    assert.deepEqual(filtrosRecebidos, [
      {
        nome: "Maria",
        categoria: ["Elétrica", "Hidráulica"],
        profissao: "Eletricista",
      },
    ]);
  });
});

test("UsuarioController busca usuário por ID para os detalhes", async () => {
  let idRecebido: string | undefined;
  const usuarioService: IUsuarioService = {
    criarUsuario: async () => usuarioResponse,
    buscarUsuario: async () => [usuarioResponse],
    buscarUsuarioPorId: async (id) => {
      idRecebido = id;
      return usuarioResponse;
    },
  };
  const aplicativo = express();
  aplicativo.get(
    "/:id",
    new UsuarioController(usuarioService).buscarUsuarioPorId,
  );

  await comServidorHttp(aplicativo, async (urlBase) => {
    const resposta = await fetch(`${urlBase}/${usuarioResponse.id}`);

    assert.equal(resposta.status, 200);
    assert.deepEqual(await resposta.json(), usuarioResponse);
    assert.equal(idRecebido, usuarioResponse.id);
  });
});

test("UsuarioController edita usuário pelo ID", async () => {
  let idRecebido: string | undefined;
  let dadosRecebidos: unknown;
  const usuarioService: IUsuarioService = {
    criarUsuario: async () => usuarioResponse,
    buscarUsuario: async () => [usuarioResponse],
    buscarUsuarioPorId: async () => usuarioResponse,
    editarUsuario: async (id, dados) => {
      idRecebido = id;
      dadosRecebidos = dados;
      return usuarioResponse;
    },
  };
  const aplicativo = express();
  aplicativo.use(express.json());
  aplicativo.put(
    "/:id",
    new UsuarioController(usuarioService).editarUsuario,
  );

  await comServidorHttp(aplicativo, async (urlBase) => {
    const resposta = await fetch(`${urlBase}/${usuarioResponse.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        nome: "Maria Silva",
        telefone: "83999999999",
        cidade: 1,
        trabalhos: [
          {
            profissao: "Eletricista",
            categoria: "Elétrica",
            status: true,
            descricao: "Instalações",
          },
        ],
      }),
    });

    assert.equal(resposta.status, 200);
    assert.deepEqual(await resposta.json(), usuarioResponse);
    assert.equal(idRecebido, usuarioResponse.id);
    assert.deepEqual(dadosRecebidos, {
      nome: "Maria Silva",
      telefone: "83999999999",
      cidade: 1,
      trabalhos: [
        {
          profissao: "Eletricista",
          categoria: "Elétrica",
          status: true,
          descricao: "Instalações",
        },
      ],
    });
  });
});

test("UsuarioController exclui usuário pelo ID", async () => {
  let idRecebido: string | undefined;
  const usuarioService: IUsuarioService = {
    criarUsuario: async () => usuarioResponse,
    buscarUsuario: async () => [usuarioResponse],
    excluirUsuario: async (id) => {
      idRecebido = id;
    },
  };
  const aplicativo = express();
  aplicativo.delete(
    "/:id",
    new UsuarioController(usuarioService).excluirUsuario,
  );

  await comServidorHttp(aplicativo, async (urlBase) => {
    const resposta = await fetch(`${urlBase}/${usuarioResponse.id}`, {
      method: "DELETE",
    });

    assert.equal(resposta.status, 204);
    assert.equal(idRecebido, usuarioResponse.id);
  });
});
