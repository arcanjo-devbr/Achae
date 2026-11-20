import {UsuarioTrabalha } from "../entities";
import { UsuarioTrabalhaInput } from "../services/IUsuarioTrabalhaService";
import { AbstractMapper } from "./AbstractMapper";

export class UsuarioTrabalhaMapper extends AbstractMapper<UsuarioTrabalha, void, UsuarioTrabalhaInput>{
    toEntity(dadosRequisicao: UsuarioTrabalhaInput): UsuarioTrabalha {
        return Object.assign(new UsuarioTrabalha(), dadosRequisicao)
    }
    toDTOResponse(dadosEntidade: UsuarioTrabalha): void {};

}