import { UsuarioResponseDTO, UsuarioRequestDTO} from "../dto";
import type { UsuarioFiltros } from "../repository/IUsuarioRepository";

export interface IUsuarioService {
     criarUsuario(dadosRequisicao : UsuarioRequestDTO) : Promise<UsuarioResponseDTO>;
     buscarUsuario() : Promise<UsuarioResponseDTO[]>;
     buscarUsuarioComFiltros?(filtros: UsuarioFiltros) : Promise<UsuarioResponseDTO[]>;
     buscarUsuarioPorId?(id: string) : Promise<UsuarioResponseDTO | null>;
     editarUsuario?(id: string, dadosRequisicao: UsuarioRequestDTO) : Promise<UsuarioResponseDTO>;
     excluirUsuario?(id: string) : Promise<void>;
}
