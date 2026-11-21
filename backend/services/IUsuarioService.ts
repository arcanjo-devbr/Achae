import { UsuarioResponseDTO, UsuarioRequestDTO} from "../dto";

export interface IUsuarioService {
     criarUsuario(dadosRequisicao : UsuarioRequestDTO) : Promise<UsuarioResponseDTO>;
     buscarUsuario() : Promise<UsuarioResponseDTO[]>;
}
