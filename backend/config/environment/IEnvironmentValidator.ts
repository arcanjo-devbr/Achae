import type { RefinementCtx } from "zod";
import type { EnvironmentVariables } from "./EnvironmentVariables";

export interface IEnvironmentValidator {
  validate(
    environment: EnvironmentVariables,
    context: RefinementCtx,
  ): void;
}
