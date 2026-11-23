import { CategoriaProfissional } from "../entities";
import { ICategoriaProfissionalRepository } from "../repository";
import { ICategoriaService } from "./ICategoriaService";


export class CategoriaServiceImpl implements ICategoriaService {
    constructor (
        private readonly categoriaRepository : ICategoriaProfissionalRepository
    ) {}

    async buscarTodasCategorias(): Promise<CategoriaProfissional[]> {
       return await this.categoriaRepository.buscarTodos();
    }
    
}