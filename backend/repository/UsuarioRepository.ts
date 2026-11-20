import { ILike, type Repository } from "typeorm";
import { Usuario } from "../entities/Usuario";
import { IUsuarioRepository } from "./IUsuarioRepository";

export class UsuarioRepository implements IUsuarioRepository {
  constructor(private readonly repository: Repository<Usuario>) {}

  buscarTodos(): Promise<Usuario[]> {
    return this.repository.find();
  }

  buscarTodosComRelacoes(): Promise<Usuario[]> {
    return this.repository.find({
      relations: {
        cidade: true,
        vinculosProfissionais: {
          profissao: { categoriaProfissional: true },
        },
      },
    });
  }

  buscarPorId(identificador: string): Promise<Usuario | null> {
    return this.repository.findOneBy({ identificador });
  }

  buscarPorIdComRelacoes(identificador: string): Promise<Usuario | null> {
    return this.repository.findOne({
      where: { identificador },
      relations: {
        cidade: true,
        vinculosProfissionais: {
          profissao: { categoriaProfissional: true },
        },
      },
    });
  }

  buscarPorNome(nome: string): Promise<Usuario | null> {
    return this.repository.findOne({
      where: { nome: ILike(`%${nome}%`) },
    });
  }

  salvar(usuario: Usuario): Promise<Usuario> {
    return this.repository.save(usuario);
  }

  async excluirPorId(identificador: string): Promise<void> {
    await this.repository.delete(identificador);
  }
}
