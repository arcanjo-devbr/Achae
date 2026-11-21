import { UsuarioTrabalhaMapper } from "../mapper/UsuarioTrabalhaMapper";
import { IUsuarioTrabalhaRepository } from "../repository";
import {
  IUsuarioTrabalhaService,
  UsuarioTrabalhaInput,
} from "./IUsuarioTrabalhaService";

export class UsuarioTrabalhaServiceImpl implements IUsuarioTrabalhaService {
  constructor(
    private readonly usuarioTrabalhaRepository: IUsuarioTrabalhaRepository,
    private readonly usuarioTrabalhaMapper : UsuarioTrabalhaMapper
  ) {}

  async relacionarProfissaoUsuario(
    dados: UsuarioTrabalhaInput,
  ): Promise<void> {
    const vinculo = this.usuarioTrabalhaMapper.toEntity(dados);
    await this.usuarioTrabalhaRepository.salvar(vinculo);
  }
}
