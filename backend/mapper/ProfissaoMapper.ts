
import { CategoriaProfissional, Profissao } from "../entities";
import { AbstractMapper } from "./AbstractMapper";

export type ProfissaoEntityInput = Readonly<{
  nome: string;
  categoriaProfissional: CategoriaProfissional;
}>;

export class ProfissaoMapper extends AbstractMapper<
  Profissao,
  void,
  ProfissaoEntityInput
> {
  toEntity({
    nome,
    categoriaProfissional,
  }: ProfissaoEntityInput): Profissao {
    return Object.assign(new Profissao(), {
      nome,
      categoriaProfissional,
    });
  }

  toDTOResponse(profissao: Profissao): void {}
}