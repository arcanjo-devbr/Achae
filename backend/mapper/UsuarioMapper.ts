import { UsuarioRequestDTO, UsuarioResponseDTO } from "../dto";
import { Cidade, Usuario } from "../entities";
import { AbstractMapper } from "./AbstractMapper";

export type UsuarioEntityInput = Readonly<{
  request: UsuarioRequestDTO;
  cidade: Cidade;
}>;

export class UsuarioMapper extends AbstractMapper<
  Usuario,
  UsuarioResponseDTO,
  UsuarioEntityInput
> {
  toEntity({ request, cidade }: UsuarioEntityInput): Usuario {
    return Object.assign(new Usuario(), {
      nome: request.nome,
      telefone: request.telefone,
      cidade,
    });
  }

  toDTOResponse(usuario: Usuario): UsuarioResponseDTO {
    const { cidade, vinculosProfissionais } = usuario;
    if (!cidade || !Array.isArray(vinculosProfissionais)) {
      throw new Error("As relações do usuário não foram carregadas.");
    }

    return {
      id: usuario.identificador,
      nome: usuario.nome,
      telefone: usuario.telefone,
      cidade: cidade.identificador,
      cidade_nome: cidade.nome,
      trabalhos: vinculosProfissionais.map((vinculo) => {
        const profissao = vinculo.profissao;
        const categoria = profissao?.categoriaProfissional;
        if (!profissao || !categoria) {
          throw new Error("As relações do vínculo profissional não foram carregadas.");
        }

        return {
          id: vinculo.identificador,
          profissao: profissao.nome,
          categoria: categoria.nome,
          status: vinculo.status,
          descricao: vinculo.descricao,
        };
      }),
    };
  }
}