import { type Repository } from "typeorm";
import { UsuarioTrabalha } from "../entities/UsuarioTrabalha";
import { IUsuarioTrabalhaRepository } from "./IUsuarioTrabalhaRepository";

export class UsuarioTrabalhaRepository implements IUsuarioTrabalhaRepository {
  constructor(private readonly repository: Repository<UsuarioTrabalha>) {}

  salvar(vinculo: UsuarioTrabalha): Promise<UsuarioTrabalha> {
    return this.repository.save(vinculo);
  }
}
