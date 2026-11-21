import { Cidade } from "../entities/Cidade";
import { ICidadeRepository } from "../repository/ICidadeRepository";
import { ICidadeService } from "./ICidadeService";

export class CidadeServiceImpl implements ICidadeService {
  constructor(private readonly cidadeRepository: ICidadeRepository) {}

  buscarTodasCidades(): Promise<Cidade[]> {
    return this.cidadeRepository.buscarTodos();
  }
}
