import { UsuarioResponseDTO } from "./Usuario"

export type PropsProfissionalItem = {
    dadosProfissional: UsuarioResponseDTO,
    selecionarServico: () => void
}