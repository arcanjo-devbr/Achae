import { Environments } from "../const/Environments";

export type ExecutionEnvironment = (typeof Environments)[number];

export type EnvironmentVariables = Readonly<{
  NODE_ENV: ExecutionEnvironment;
  PORT?: string;
  DATABASE_URL?: string;
  DATABASE_URL_POOLED?: string;
  URL_BANCO_POOLED?: string;
  DATABASE_URL_TEST?: string;
  DATABASE_URL_DEVELOPMENT?: string;
  DATABASE_URL_PRODUCTION?: string;
}>;
