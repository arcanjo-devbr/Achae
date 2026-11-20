import { UsuarioTrabalha } from "../entities/UsuarioTrabalha";
import { IUsuarioTrabalhaRepository } from "../repository";
import {
  IUsuarioTrabalhaService,
  UsuarioTrabalhaInput,
} from "./IUsuarioTrabalhaService";

export class UsuarioTrabalhaServiceImpl implements IUsuarioTrabalhaService {
  constructor(
    private readonly usuarioTrabalhaRepository: IUsuarioTrabalhaRepository,
  ) {}

  async relacionarProfissaoUsuario(
    dados: UsuarioTrabalhaInput,
  ): Promise<void> {
    const vinculo = Object.assign(new UsuarioTrabalha(), dados);
    await this.usuarioTrabalhaRepository.salvar(vinculo);
  }
}
