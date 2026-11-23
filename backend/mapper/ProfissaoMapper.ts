
import {Profissao, Usuario } from "../entities";
import { AbstractMapper } from "./AbstractMapper";

export type ProfissaoEntityInput = Readonly<{
  nome: string
}>;

export class ProfissaoMapper extends AbstractMapper<
  Profissao,
  void,
  ProfissaoEntityInput
> {
  toEntity({ nome }: ProfissaoEntityInput): Profissao {
    return Object.assign(new Profissao(), {
      nome
    });
  }

  toDTOResponse(profissao: Profissao): void {}
}