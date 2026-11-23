import type { RefinementCtx } from "zod";
import type { EnvironmentVariables } from "./EnvironmentVariables";
import { IEnvironmentValidator } from "./IEnvironmentValidator";

function adicionarErro(
  context: RefinementCtx,
  campo: string,
  mensagem: string,
): void {
  context.addIssue({ code: "custom", path: [campo], message: mensagem });
}

function validarPorta(
  porta: string | undefined,
  context: RefinementCtx,
): void {
  if (!porta?.trim()) {
    adicionarErro(context, "PORT", "PORT é obrigatória no ambiente development.");
  } else if (!/^\d+$/.test(porta.trim())) {
    adicionarErro(context, "PORT", "PORT deve ser um número inteiro.");
  } else {
    const valor = Number(porta);
    if (!Number.isSafeInteger(valor) || valor < 1 || valor > 65535) {
      adicionarErro(context, "PORT", "PORT deve estar entre 1 e 65535.");
    }
  }
}

function validarUrl(
  valor: string | undefined,
  campo: "DATABASE_URL" | "DATABASE_URL_POOLED",
  context: RefinementCtx,
  obrigatoria: boolean,
): void {
  if (!valor?.trim()) {
    if (obrigatoria) {
      adicionarErro(context, campo, `${campo} é obrigatória no ambiente development.`);
    } else if (valor !== undefined) {
      adicionarErro(context, campo, `${campo} não pode estar vazia.`);
    }
    return;
  }

  try {
    const url = new URL(valor);
    if (
      !["postgres:", "postgresql:"].includes(url.protocol) ||
      !url.hostname ||
      url.pathname.length <= 1
    ) {
      adicionarErro(context, campo, `${campo} deve ser uma URL PostgreSQL válida.`);
    }
  } catch {
    adicionarErro(context, campo, `${campo} deve ser uma URL PostgreSQL válida.`);
  }
}

export class DevelopmentEnvironmentValidator
  implements IEnvironmentValidator
{
  validate(
    environment: EnvironmentVariables,
    context: RefinementCtx,
  ): void {
    validarPorta(environment.PORT, context);
    validarUrl(environment.DATABASE_URL, "DATABASE_URL", context, true);
    validarUrl(
      environment.DATABASE_URL_POOLED,
      "DATABASE_URL_POOLED",
      context,
      false,
    );

    if (environment.URL_BANCO_POOLED !== undefined) {
      adicionarErro(
        context,
        "URL_BANCO_POOLED",
        "Use DATABASE_URL_POOLED em vez de URL_BANCO_POOLED.",
      );
    }
    if (environment.DATABASE_URL_TEST !== undefined) {
      adicionarErro(
        context,
        "DATABASE_URL_TEST",
        "DATABASE_URL_TEST não deve ser usado no ambiente development.",
      );
    }
  }
}
