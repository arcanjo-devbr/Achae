import assert from "node:assert/strict";
import test from "node:test";
import { getMetadataArgsStorage } from "typeorm";
import {
  assertEntityCanBeModified,
  ReadOnlyEntityMutationError,
} from "../entities/ReadOnlyEntitySubscriber";
import {
  CategoriaProfissional,
  Cidade,
  ENTITY_CLASSES,
  Profissao,
  READ_ONLY_ENTITY_CLASSES,
  Usuario,
  UsuarioTrabalha,
} from "../entities";

test("registra todas as entidades e tipos de identificador esperados", () => {
  const storage = getMetadataArgsStorage();

  assert.deepEqual(ENTITY_CLASSES, [
    Cidade,
    Profissao,
    CategoriaProfissional,
    Usuario,
    UsuarioTrabalha,
  ]);

  const tiposIdentificadores = new Map<Function, string>([
    [Cidade, "integer"],
    [Profissao, "integer"],
    [CategoriaProfissional, "integer"],
    [Usuario, "uuid"],
    [UsuarioTrabalha, "uuid"],
  ]);

  for (const [entidade, tipo] of tiposIdentificadores) {
    const coluna = storage.columns.find(
      (item) =>
        item.target === entidade && item.propertyName === "identificador",
    );

    assert.equal(coluna?.options.type, tipo, entidade.name);
    assert.equal(coluna?.options.primary, true, entidade.name);
  }
});

test("define unicidade para cada campo nome", () => {
  const storage = getMetadataArgsStorage();
  const entidadesComNomeUnico = [
    Cidade,
    Profissao,
    CategoriaProfissional,
    Usuario,
  ];

  for (const entidade of entidadesComNomeUnico) {
    const nome = storage.columns.find(
      (item) => item.target === entidade && item.propertyName === "nome",
    );

    assert.equal(nome?.options.unique, true, entidade.name);
  }
});

test("mapeia os atributos definidos no modelo", () => {
  const storage = getMetadataArgsStorage();
  const atributos = [
    [Cidade, "nome", "varchar"],
    [Profissao, "nome", "varchar"],
    [Profissao, "especialidade", "varchar"],
    [CategoriaProfissional, "nome", "varchar"],
    [CategoriaProfissional, "categoria", "varchar"],
    [Usuario, "nome", "varchar"],
    [Usuario, "telefone", "varchar"],
    [UsuarioTrabalha, "status", "boolean"],
    [UsuarioTrabalha, "descricao", "varchar"],
  ] as const;

  for (const [entidade, propriedade, tipo] of atributos) {
    const coluna = storage.columns.find(
      (item) =>
        item.target === entidade && item.propertyName === propriedade,
    );

    assert.equal(coluna?.options.type, tipo, `${entidade.name}.${propriedade}`);
  }
});

test("mantém relações bidirecionais e suas cardinalidades", () => {
  const storage = getMetadataArgsStorage();
  const expectedRelations = [
    [Usuario, "cidade", "many-to-one"],
    [Cidade, "usuarios", "one-to-many"],
    [Profissao, "categoriaProfissional", "many-to-one"],
    [CategoriaProfissional, "profissoes", "one-to-many"],
    [UsuarioTrabalha, "usuario", "many-to-one"],
    [Usuario, "vinculosProfissionais", "one-to-many"],
    [UsuarioTrabalha, "profissao", "many-to-one"],
    [Profissao, "vinculosUsuarios", "one-to-many"],
  ] as const;

  for (const [entidade, propriedade, tipo] of expectedRelations) {
    const relacao = storage.relations.find(
      (item) =>
        item.target === entidade && item.propertyName === propriedade,
    );

    assert.equal(relacao?.relationType, tipo, `${entidade.name}.${propriedade}`);
    assert.ok(
      relacao?.inverseSideProperty,
      `${entidade.name}.${propriedade} deve apontar para o lado inverso`,
    );
  }
});

test("exige chaves estrangeiras e restringe exclusões de entidades relacionadas", () => {
  const storage = getMetadataArgsStorage();
  const requiredRelations = [
    [Usuario, "cidade"],
    [Profissao, "categoriaProfissional"],
    [UsuarioTrabalha, "usuario"],
    [UsuarioTrabalha, "profissao"],
  ] as const;

  for (const [entidade, propriedade] of requiredRelations) {
    const relacao = storage.relations.find(
      (item) =>
        item.target === entidade && item.propertyName === propriedade,
    );

    assert.equal(relacao?.options.nullable, false, `${entidade.name}.${propriedade}`);
    assert.equal(
      relacao?.options.onDelete,
      "RESTRICT",
      `${entidade.name}.${propriedade}`,
    );
  }
});

test("bloqueia mutações de catálogos e permite mutações de entidades editáveis", () => {
  for (const entidade of READ_ONLY_ENTITY_CLASSES) {
    for (const operacao of [
      "inserção",
      "atualização",
      "remoção",
    ] as const) {
      assert.throws(
        () => assertEntityCanBeModified(entidade, operacao),
        ReadOnlyEntityMutationError,
      );
    }
  }

  assert.doesNotThrow(() => assertEntityCanBeModified(Usuario, "inserção"));
  assert.doesNotThrow(() =>
    assertEntityCanBeModified(UsuarioTrabalha, "atualização"),
  );
});
