
import {Profissao, Usuario } from "../entities";
import { AbstractMapper } from "./AbstractMapper";

export type ProfissaoEntityInput = Readonly<{
  especialidade: string
}>;

export class ProfissaoMapper extends AbstractMapper<
  Profissao,
  void,
  ProfissaoEntityInput
> {
  toEntity({ especialidade }: ProfissaoEntityInput): Profissao {
    return Object.assign(new Profissao(), {
      especialidade
    });
  }

  toDTOResponse(profissao: Profissao): void {}
}