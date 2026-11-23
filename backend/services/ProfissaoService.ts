import { Profissao } from "../entities";
import { IProfissaoRepository } from "../repository";
import { IProfissaoService } from "./IProfissaoService";

export class ProfissaoService implements IProfissaoService{

    constructor (
        private readonly profissaoRepository : IProfissaoRepository
    ){}
    
    
    async buscarTodos(): Promise<Profissao[]> {
        return await this.profissaoRepository.buscarTodos();
    }
    async buscarPorCategoria(categoria: number): Promise<Profissao[]> {
       return await this.profissaoRepository.buscarPorCategoriaProfissional(categoria);
    }
;



}