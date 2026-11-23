import assert from "node:assert/strict";
import test from "node:test";
import { Environments } from "../config/const/Environments";
import {
  DevelopmentEnvironmentValidator,
} from "../config/environment/DevelopmentEnvironmentValidator";
import {
  EnvironmentVariablesSchema,
} from "../config/environment/EnvironmentVariablesSchema";
import {
  listarAmbientesValidados,
  obterValidadorAmbiente,
} from "../config/environment/EnvironmentValidatorRegistry";
import {
  ProductionEnvironmentValidator,
} from "../config/environment/ProductionEnvironmentValidator";
import { TestEnvironmentValidator } from "../config/environment/TestEnvironmentValidator";

function configuracaoValida(
  NODE_ENV: (typeof Environments)[number],
): Record<string, string> {
  return {
    NODE_ENV,
    PORT: "3000",
    DATABASE_URL:
      NODE_ENV === "test"
        ? "postgresql://localhost/app_test"
        : "postgresql://localhost/app",
  };
}

test("registra um validador especializado para cada ambiente suportado", () => {
  assert.deepEqual(listarAmbientesValidados(), Environments);
  assert.ok(
    obterValidadorAmbiente("development") instanceof
      DevelopmentEnvironmentValidator,
  );
  assert.ok(obterValidadorAmbiente("test") instanceof TestEnvironmentValidator);
  assert.ok(
    obterValidadorAmbiente("production") instanceof
      ProductionEnvironmentValidator,
  );
  assert.equal(
    new Set(Environments.map(obterValidadorAmbiente)).size,
    Environments.length,
  );
});

test("superRefine seleciona o validador correspondente a cada ambiente", () => {
  for (const environment of Environments) {
    const configuration = configuracaoValida(environment);
    delete configuration.PORT;

    const resultado = EnvironmentVariablesSchema.safeParse(configuration);

    assert.equal(resultado.success, false, environment);
    if (!resultado.success) {
      const erroPorta = resultado.error.issues.find(
        (issue) => issue.path[0] === "PORT",
      );
      assert.ok(erroPorta?.message.includes(environment), environment);
    }

    const configurationWithoutDatabase = configuracaoValida(environment);
    delete configurationWithoutDatabase.DATABASE_URL;
    const resultadoSemBanco = EnvironmentVariablesSchema.safeParse(
      configurationWithoutDatabase,
    );

    assert.equal(resultadoSemBanco.success, false, environment);
    if (!resultadoSemBanco.success) {
      assert.ok(
        resultadoSemBanco.error.issues.some(
          (issue) => issue.path[0] === "DATABASE_URL",
        ),
        environment,
      );
    }
  }
});

test("aceita as variáveis obrigatórias e pooled opcional nos três ambientes", () => {
  for (const environment of Environments) {
    const resultado = EnvironmentVariablesSchema.safeParse(
      configuracaoValida(environment),
    );
    assert.equal(resultado.success, true, environment);

    const resultadoComPooled = EnvironmentVariablesSchema.safeParse({
      ...configuracaoValida(environment),
      DATABASE_URL_POOLED: "postgres://localhost/app_pooled",
    });

    test("aplica regras específicas e incompatibilidades próprias de cada ambiente", () => {
      const development = EnvironmentVariablesSchema.safeParse({
        ...configuracaoValida("development"),
        DATABASE_URL_TEST: "postgresql://localhost/app_test",
      });
      assert.equal(development.success, false);
      if (!development.success) {
        assert.ok(
          development.error.issues.some(
            (issue) => issue.path[0] === "DATABASE_URL_TEST",
          ),
        );
      }

      const test = EnvironmentVariablesSchema.safeParse({
        ...configuracaoValida("test"),
        DATABASE_URL_PRODUCTION:
          "postgresql://localhost/app_production",
      });
      assert.equal(test.success, false);
      if (!test.success) {
        assert.ok(
          test.error.issues.some(
            (issue) => issue.path[0] === "DATABASE_URL_PRODUCTION",
          ),
        );
      }

      const production = EnvironmentVariablesSchema.safeParse({
        ...configuracaoValida("production"),
        DATABASE_URL_TEST: "postgresql://localhost/app_test",
      });
      assert.equal(production.success, false);
      if (!production.success) {
        assert.ok(
          production.error.issues.some(
            (issue) => issue.path[0] === "DATABASE_URL_TEST",
          ),
        );
      }

      const legado = EnvironmentVariablesSchema.safeParse({
        ...configuracaoValida("development"),
        URL_BANCO_POOLED: "postgresql://localhost/app_pooled",
      });
      assert.equal(legado.success, false);
    });

    test("exige isolamento do banco no ambiente test", () => {
      const resultadoValido = EnvironmentVariablesSchema.safeParse(
        configuracaoValida("test"),
      );
      assert.equal(resultadoValido.success, true);

      const resultadoInvalido = EnvironmentVariablesSchema.safeParse({
        ...configuracaoValida("test"),
        DATABASE_URL: "postgresql://localhost/app",
      });
      assert.equal(resultadoInvalido.success, false);
      if (!resultadoInvalido.success) {
        assert.ok(
          resultadoInvalido.error.issues.some(
            (issue) =>
              issue.path[0] === "DATABASE_URL" &&
              issue.message.includes("test"),
          ),
        );
      }
    });
    assert.equal(resultadoComPooled.success, true, environment);
  }
});

test("rejeita porta fora do formato/faixa e URLs que não sejam PostgreSQL", () => {
  const casosInvalidos = [
    { ...configuracaoValida("development"), PORT: "abc" },
    { ...configuracaoValida("test"), PORT: "65536" },
    { ...configuracaoValida("production"), DATABASE_URL: "https://example.com/db" },
    {
      ...configuracaoValida("development"),
      DATABASE_URL_POOLED: "not-a-database-url",
    },
  ];

  for (const configuration of casosInvalidos) {
    assert.equal(EnvironmentVariablesSchema.safeParse(configuration).success, false);
  }
});

test("rejeita identificadores de ambiente não suportados", () => {
  const resultado = EnvironmentVariablesSchema.safeParse({
    ...configuracaoValida("development"),
    NODE_ENV: "staging",
  });

  assert.equal(resultado.success, false);
});
