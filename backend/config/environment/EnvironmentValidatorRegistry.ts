import { Environments } from "../const/Environments";
import { DevelopmentEnvironmentValidator } from "./DevelopmentEnvironmentValidator";
import { ProductionEnvironmentValidator } from "./ProductionEnvironmentValidator";
import { TestEnvironmentValidator } from "./TestEnvironmentValidator";
import type {
  ExecutionEnvironment,
} from "./EnvironmentVariables";
import type { IEnvironmentValidator } from "./IEnvironmentValidator";

const validators = Object.freeze({
  development: new DevelopmentEnvironmentValidator(),
  test: new TestEnvironmentValidator(),
  production: new ProductionEnvironmentValidator(),
} satisfies Record<ExecutionEnvironment, IEnvironmentValidator>);

export function obterValidadorAmbiente(
  environment: ExecutionEnvironment,
): IEnvironmentValidator {
  return validators[environment];
}

export function listarAmbientesValidados(): readonly ExecutionEnvironment[] {
  return Environments;
}
