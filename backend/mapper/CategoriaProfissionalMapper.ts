
import {CategoriaProfissional} from "../entities";
import { AbstractMapper } from "./AbstractMapper";

export type CategoriaProfissaoEntityInput = Readonly<{
  nome: string
}>;

export class CategoriaProfissionalMapper extends AbstractMapper<
  CategoriaProfissional,
  void,
  CategoriaProfissaoEntityInput
> {
  toEntity({ nome }: CategoriaProfissaoEntityInput): CategoriaProfissional {
    return Object.assign(new CategoriaProfissional(), {
      nome
    });
  }

  toDTOResponse(profissao: CategoriaProfissional): void {}
}