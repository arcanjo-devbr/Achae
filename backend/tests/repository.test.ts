import assert from "node:assert/strict";
import test from "node:test";
import type { Repository } from "typeorm";
import {
  CategoriaProfissionalRepository,
  CidadeRepository,
  ProfissaoRepository,
  UsuarioRepository,
} from "../repository";
import { CategoriaProfissional } from "../entities/CategoriaProfissional";
import { Cidade } from "../entities/Cidade";
import { Profissao } from "../entities/Profissao";
import { Usuario } from "../entities/Usuario";

test("UsuarioRepository delega consultas, persistência e exclusão", async () => {
  const usuario = {} as Usuario;
  const calls: string[] = [];
  const repository = {
    find: async () => {
      calls.push("find");
      return [usuario];
    },
    findOneBy: async (where: object) => {
      calls.push(`findOneBy:${JSON.stringify(where)}`);
      return usuario;
    },
    findOne: async (where: object) => {
      calls.push("findOne");
      return usuario;
    },
    save: async (value: Usuario) => {
      calls.push("save");
      return value;
    },
    delete: async (identificador: string) => {
      calls.push(`delete:${identificador}`);
      return { affected: 1, raw: [] };
    },
  } as unknown as Repository<Usuario>;

  const service = new UsuarioRepository(repository);

  assert.deepEqual(await service.buscarTodos(), [usuario]);
  assert.equal(await service.buscarPorId("usuario-id"), usuario);
  assert.equal(await service.buscarPorNome("ana"), usuario);
  assert.equal(await service.salvar(usuario), usuario);
  await service.excluirPorId("usuario-id");

  assert.deepEqual(calls, [
    "find",
    'findOneBy:{"identificador":"usuario-id"}',
    "findOne",
    "save",
    "delete:usuario-id",
  ]);
});

test("repositories de catálogo executam consultas e preservam filtros", async () => {
  const cidade = {} as Cidade;
  const profissao = {} as Profissao;
  const categoria = {} as CategoriaProfissional;
  const cidadeCalls: object[] = [];
  const profissaoCalls: object[] = [];
  const categoriaCalls: object[] = [];

  const cidadeRepository = {
    find: async () => [cidade],
    findOneBy: async (where: object) => {
      cidadeCalls.push(where);
      return cidade;
    },
  } as unknown as Repository<Cidade>;
  const profissaoRepository = {
    find: async (options: object) => {
      profissaoCalls.push(options);
      return [profissao];
    },
    findOne: async (options: object) => {
      profissaoCalls.push(options);
      return profissao;
    },
    findOneBy: async (where: object) => {
      profissaoCalls.push(where);
      return profissao;
    },
  } as unknown as Repository<Profissao>;
  const categoriaRepository = {
    find: async () => [categoria],
    findOneBy: async (where: object) => {
      categoriaCalls.push(where);
      return categoria;
    },
  } as unknown as Repository<CategoriaProfissional>;

  const cidades = new CidadeRepository(cidadeRepository);
  const profissoes = new ProfissaoRepository(profissaoRepository);
  const categorias = new CategoriaProfissionalRepository(categoriaRepository);

  assert.deepEqual(await cidades.buscarTodos(), [cidade]);
  assert.equal(await cidades.buscarPorId(1), cidade);
  assert.equal(await cidades.buscarPorNome("rio"), cidade);

  assert.deepEqual(await profissoes.buscarTodos(), [profissao]);
  assert.equal(await profissoes.buscarPorNome("engenharia"), profissao);
  assert.deepEqual(
    await profissoes.buscarPorCategoriaProfissional(3),
    [profissao],
  );

  assert.deepEqual(await categorias.buscarTodos(), [categoria]);
  assert.equal(await categorias.buscarPorId(4), categoria);
  assert.equal(await categorias.buscarPorNome("saude"), categoria);

  assert.deepEqual(cidadeCalls[0], { identificador: 1 });
  assert.equal(
    (cidadeCalls[1] as { nome: { _type: string; _value: string } }).nome._type,
    "ilike",
  );
  assert.equal(
    (cidadeCalls[1] as { nome: { _type: string; _value: string } }).nome._value,
    "%rio%",
  );
  assert.equal(
    (profissaoCalls[1] as {
      relations: { categoriaProfissional: boolean };
      where: { nome: { _type: string; _value: string } };
    }).relations.categoriaProfissional,
    true,
  );
  assert.equal(
    (profissaoCalls[1] as {
      where: { nome: { _type: string; _value: string } };
    }).where.nome._type,
    "ilike",
  );
  assert.deepEqual(profissaoCalls[2], {
    where: { categoriaProfissional: { identificador: 3 } },
  });
  assert.deepEqual(categoriaCalls[0], { identificador: 4 });
});
