import { Cidade } from "../entities/Cidade";

export interface ICidadeService {
  buscarTodasCidades(): Promise<Cidade[]>;
}
