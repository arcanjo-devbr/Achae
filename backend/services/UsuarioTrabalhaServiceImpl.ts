import { UsuarioTrabalhaMapper } from "../mapper/UsuarioTrabalhaMapper";
import { Usuario } from "../entities";
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

  async substituirProfissoesUsuario(
    usuario: Usuario,
    trabalhos: UsuarioTrabalhaInput[],
  ): Promise<void> {
    await this.usuarioTrabalhaRepository.excluirPorUsuario(
      usuario.identificador,
    );

    await Promise.all(
      trabalhos.map((dados) =>
        this.relacionarProfissaoUsuario({
          ...dados,
          usuario,
        }),
      ),
    );
  }

  async excluirProfissoesUsuario(usuario: Usuario): Promise<void> {
    await this.usuarioTrabalhaRepository.excluirPorUsuario(
      usuario.identificador,
    );
  }
}
