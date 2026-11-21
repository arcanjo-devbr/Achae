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
    trabalhos: [
      {
        profissao: "Eletricista",
        categoria: "Elétrica",
        status: true,
        descricao: "Instalações residenciais",
      },
    ],
  };

  assert.deepEqual(Object.keys(usuario).sort(), [
    "cidade",
    "nome",
    "telefone",
    "trabalhos",
  ]);
});

test("define o contrato do UsuarioResponseDTO", () => {
  const usuario: UsuarioResponseDTO = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    nome: "Maria",
    telefone: "11999999999",
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

  assert.deepEqual(Object.keys(usuario).sort(), [
    "cidade",
    "id",
    "nome",
    "telefone",
    "trabalhos",
  ]);
});
