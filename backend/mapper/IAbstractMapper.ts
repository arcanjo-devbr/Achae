export interface IAbstractMapper <Entity, DTOResponse, DTORequest> {
    toEntity(dadosRequisicao : DTORequest) : Entity;
    toDTOResponse(dadosEntidade : Entity) : DTOResponse;
}