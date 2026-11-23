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
    adicionarErro(context, "PORT", "PORT é obrigatória no ambiente test.");
  } else if (!/^\d+$/.test(porta.trim())) {
    adicionarErro(context, "PORT", "PORT deve ser um número inteiro.");
  } else {
    const valor = Number(porta);
    if (!Number.isSafeInteger(valor) || valor < 1 || valor > 65535) {
      adicionarErro(context, "PORT", "PORT deve estar entre 1 e 65535.");
    }
  }
}

function validarUrlBanco(
  valor: string | undefined,
  context: RefinementCtx,
): void {
  if (!valor?.trim()) {
    adicionarErro(context, "DATABASE_URL", "DATABASE_URL é obrigatória no ambiente test.");
    return;
  }

  try {
    const url = new URL(valor);
    if (
      !["postgres:", "postgresql:"].includes(url.protocol) ||
      !url.hostname
    ) {
      adicionarErro(context, "DATABASE_URL", "DATABASE_URL deve ser uma URL PostgreSQL válida.");
      return;
    }

    const nomeBanco = decodeURIComponent(
      url.pathname.split("/").filter(Boolean).at(-1) ?? "",
    ).toLowerCase();
    if (nomeBanco !== "test" && !/[_-]test$/.test(nomeBanco)) {
      adicionarErro(
        context,
        "DATABASE_URL",
        "DATABASE_URL do ambiente test deve apontar para uma base cujo nome termine em test ou _test.",
      );
    }
  } catch {
    adicionarErro(context, "DATABASE_URL", "DATABASE_URL deve ser uma URL PostgreSQL válida.");
  }
}

export class TestEnvironmentValidator implements IEnvironmentValidator {
  validate(
    environment: EnvironmentVariables,
    context: RefinementCtx,
  ): void {
    validarPorta(environment.PORT, context);
    validarUrlBanco(environment.DATABASE_URL, context);

    if (environment.DATABASE_URL_POOLED?.trim()) {
      try {
        const url = new URL(environment.DATABASE_URL_POOLED);
        if (!["postgres:", "postgresql:"].includes(url.protocol) || !url.hostname) {
          adicionarErro(
            context,
            "DATABASE_URL_POOLED",
            "DATABASE_URL_POOLED deve ser uma URL PostgreSQL válida.",
          );
        }
      } catch {
        adicionarErro(
          context,
          "DATABASE_URL_POOLED",
          "DATABASE_URL_POOLED deve ser uma URL PostgreSQL válida.",
        );
      }
    } else if (environment.DATABASE_URL_POOLED !== undefined) {
      adicionarErro(
        context,
        "DATABASE_URL_POOLED",
        "DATABASE_URL_POOLED não pode estar vazia.",
      );
    }

    if (environment.URL_BANCO_POOLED !== undefined) {
      adicionarErro(
        context,
        "URL_BANCO_POOLED",
        "Use DATABASE_URL_POOLED em vez de URL_BANCO_POOLED.",
      );
    }
    if (environment.DATABASE_URL_DEVELOPMENT !== undefined) {
      adicionarErro(
        context,
        "DATABASE_URL_DEVELOPMENT",
        "DATABASE_URL_DEVELOPMENT não deve ser usado no ambiente test.",
      );
    }
    if (environment.DATABASE_URL_PRODUCTION !== undefined) {
      adicionarErro(
        context,
        "DATABASE_URL_PRODUCTION",
        "DATABASE_URL_PRODUCTION não deve ser usado no ambiente test.",
      );
    }
  }
}
