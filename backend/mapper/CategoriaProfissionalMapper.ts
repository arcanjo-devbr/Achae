
import {CategoriaProfissional} from "../entities";
import { AbstractMapper } from "./AbstractMapper";

export type CategoriaProfissaoEntityInput = Readonly<{
  categoria: string
}>;

export class CategoriaProfissionalMapper extends AbstractMapper<
  CategoriaProfissional,
  void,
  CategoriaProfissaoEntityInput
> {
  toEntity({ categoria }: CategoriaProfissaoEntityInput): CategoriaProfissional {
    return Object.assign(new CategoriaProfissional(), {
      categoria
    });
  }

  toDTOResponse(profissao: CategoriaProfissional): void {}
}