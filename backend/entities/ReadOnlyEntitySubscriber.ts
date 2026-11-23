import {
  type EntitySubscriberInterface,
  type InsertEvent,
  type RecoverEvent,
  type RemoveEvent,
  type SoftRemoveEvent,
  type UpdateEvent,
} from "typeorm";
import { READ_ONLY_ENTITY_CLASSES } from "./index";

export type EntityMutation = "inserção" | "atualização" | "remoção";

const readOnlyEntityNames = new Map<unknown, string>(
  READ_ONLY_ENTITY_CLASSES.map((entity) => [entity, entity.name]),
);

export class ReadOnlyEntityMutationError extends Error {
  constructor(entityName: string, operation: EntityMutation) {
    super(
      `A entidade ${entityName} é somente leitura; não é permitida a operação de ${operation}.`,
    );
    this.name = "ReadOnlyEntityMutationError";
  }
}

export function assertEntityCanBeModified(
  target: unknown,
  operation: EntityMutation,
): void {
  const entityName = readOnlyEntityNames.get(target);

  if (entityName !== undefined) {
    throw new ReadOnlyEntityMutationError(entityName, operation);
  }
}

export class ReadOnlyEntitySubscriber
  implements EntitySubscriberInterface
{
  beforeInsert(event: InsertEvent<unknown>): void {
    assertEntityCanBeModified(event.metadata.target, "inserção");
  }

  beforeUpdate(event: UpdateEvent<unknown>): void {
    assertEntityCanBeModified(event.metadata.target, "atualização");
  }

  beforeRemove(event: RemoveEvent<unknown>): void {
    assertEntityCanBeModified(event.metadata.target, "remoção");
  }

  beforeSoftRemove(event: SoftRemoveEvent<unknown>): void {
    assertEntityCanBeModified(event.metadata.target, "remoção");
  }

  beforeRecover(event: RecoverEvent<unknown>): void {
    assertEntityCanBeModified(event.metadata.target, "atualização");
  }
}
