import {
  AxiosHeaders,
  create,
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

export type ApiError = AxiosError & {
  mensagem?: string;
  isConnectionError?: boolean;
};

function normalizarBaseUrl(url: string | undefined): string | undefined {
  const valor = url?.trim();

  if (!valor) {
    return undefined;
  }

  const urlSemBarraFinal = valor.replace(/\/+$/, "");

  try {
    const urlConfigurada = new URL(urlSemBarraFinal);

    if (
      urlConfigurada.protocol !== "http:" &&
      urlConfigurada.protocol !== "https:"
    ) {
      throw new Error("A URL da API deve utilizar protocolo http ou https.");
    }

    if (
      urlConfigurada.pathname === "" ||
      urlConfigurada.pathname === "/"
    ) {
      return `${urlSemBarraFinal}/api`;
    }

    return urlSemBarraFinal;
  } catch {
    throw new Error(
      "EXPO_PUBLIC_API_URL invalida. Use o formato http://host:porta/api.",
    );
  }
}

export const API_BASE_URL = normalizarBaseUrl(
  process.env.EXPO_PUBLIC_API_URL,
);

export const api = create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const headers = AxiosHeaders.from(config.headers);

    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    const possuiDados =
      config.data !== undefined &&
      config.data !== null &&
      typeof config.data !== "string";

    const ehFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;

    if (possuiDados && !ehFormData && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    config.headers = headers;
    return config;
  },
  (erro: unknown) => Promise.reject(erro),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (erro: ApiError) => {
    if (erro.response) {
      const dados = erro.response.data;

      if (
        typeof dados === "object" &&
        dados !== null &&
        "mensagem" in dados &&
        typeof dados.mensagem === "string"
      ) {
        erro.mensagem = dados.mensagem;
        erro.message = dados.mensagem;
      }

      erro.isConnectionError = false;
    } else {
      erro.isConnectionError = true;
      erro.mensagem = "Nao foi possivel conectar ao servidor.";
    }

    return Promise.reject(erro);
  },
);

export default api;
