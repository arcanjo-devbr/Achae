import assert from "node:assert/strict";
import test from "node:test";
import type {
  UsuarioRequestDTO,
  UsuarioResponseDTO,
} from "../dto";

test("define o contrato do UsuarioRequestDTO", () => {
  const usuario: UsuarioRequestDTO = {
    nome: "Maria",
    telefone: "11999999999",
    cidade: 1,
    profissao: 2,
    categoria_profissional: 3,
  };

  assert.deepEqual(Object.keys(usuario).sort(), [
    "categoria_profissional",
    "cidade",
    "nome",
    "profissao",
    "telefone",
  ]);
});

test("define o contrato do UsuarioResponseDTO", () => {
  const usuario: UsuarioResponseDTO = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    nome: "Maria",
    telefone: "11999999999",
    cidade: 1,
    profissao: 2,
    categoria_profissional: 3,
  };

  assert.deepEqual(Object.keys(usuario).sort(), [
    "categoria_profissional",
    "cidade",
    "id",
    "nome",
    "profissao",
    "telefone",
  ]);
});
