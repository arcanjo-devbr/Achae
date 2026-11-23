import { Profissao } from "../entities";

export interface IProfissaoService {
    buscarTodos () : Promise<Profissao[]>;
    buscarPorCategoria (categoria : number) : Promise<Profissao[]>;
}