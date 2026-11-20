import { CategoriaProfissional } from "../entities";

export interface ICategoriaService {
    buscarTodasCategorias () : Promise<CategoriaProfissional[]>;
}