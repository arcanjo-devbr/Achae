import { IAbstractMapper } from "./IAbstractMapper";

export abstract class AbstractMapper <Entity, DTOResponse, DTORequest> 
    implements IAbstractMapper <Entity, DTOResponse, DTORequest>{
    abstract toEntity(dadosRequisicao: DTORequest): Entity;
    abstract toDTOResponse(dadosEntidade: Entity): DTOResponse;
}