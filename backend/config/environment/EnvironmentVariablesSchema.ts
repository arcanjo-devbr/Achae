import { z } from "zod";
import { Environments } from "../const/Environments";
import { obterValidadorAmbiente } from "./EnvironmentValidatorRegistry";

export const EnvironmentVariablesSchema = z
  .object({
    NODE_ENV: z.enum(Environments, {
      error: "NODE_ENV deve ser development, test ou production.",
    }),
    PORT: z.string().optional(),
    DATABASE_URL: z.string().optional(),
    DATABASE_URL_POOLED: z.string().optional(),
    URL_BANCO_POOLED: z.string().optional(),
    DATABASE_URL_TEST: z.string().optional(),
    DATABASE_URL_DEVELOPMENT: z.string().optional(),
    DATABASE_URL_PRODUCTION: z.string().optional(),
  })
  .passthrough()
  .superRefine((environment, context) => {
    obterValidadorAmbiente(environment.NODE_ENV).validate(
      environment,
      context,
    );
  });

export type ValidatedEnvironmentVariables = z.infer<
  typeof EnvironmentVariablesSchema
>;
