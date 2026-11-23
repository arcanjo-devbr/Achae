import {
  AxiosHeaders,
  create,
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

export type ApiErrorType =
  | "http"
  | "timeout"
  | "connection"
  | "cancellation";

export type ApiError = AxiosError & {
  mensagem?: string;
  isConnectionError?: boolean;
  tipoErro?: ApiErrorType;
};

function normalizarBaseUrl(
  url: string | undefined,
  ambiente: string | undefined,
): string {
  const valor = url?.trim();

  if (!valor) {
    throw new Error(
      "EXPO_PUBLIC_API_URL nao configurada. Defina a URL base da API.",
    );
  }

  const urlSemBarraFinal = valor.replace(/\/+$/, "");
  let urlConfigurada: URL;

  try {
    urlConfigurada = new URL(urlSemBarraFinal);
  } catch {
    throw new Error(
      "EXPO_PUBLIC_API_URL invalida. Use uma URL absoluta, como http://host:porta/api.",
    );
  }

  if (
    urlConfigurada.protocol !== "http:" &&
    urlConfigurada.protocol !== "https:"
  ) {
    throw new Error("A URL da API deve utilizar protocolo http ou https.");
  }

  if (urlConfigurada.search || urlConfigurada.hash) {
    throw new Error(
      "EXPO_PUBLIC_API_URL nao deve conter parametros ou fragmentos.",
    );
  }

  if (ambiente === "production" && urlConfigurada.protocol !== "https:") {
    throw new Error("A URL da API em producao deve utilizar HTTPS.");
  }

  if (
    urlConfigurada.pathname === "" ||
    urlConfigurada.pathname === "/"
  ) {
    return `${urlSemBarraFinal}/api`;
  }

  return urlSemBarraFinal;
}

export const API_BASE_URL = normalizarBaseUrl(
  process.env.EXPO_PUBLIC_API_URL,
  process.env.NODE_ENV,
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
      config.data !== null;


    const ehObjeto =
      typeof config.data === "object" &&
      config.data !== null;

    const ehFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;

    if (possuiDados && ehObjeto && !ehFormData && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    config.headers = headers;
    return config;
  },
  (erro: unknown) => Promise.reject(erro),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (erro: unknown) => {
    const axiosError = erro as ApiError;

    if ("__CANCEL__" in axiosError && axiosError.__CANCEL__) {
      const cancelamento = axiosError as ApiError;
      cancelamento.tipoErro = "cancellation";
      cancelamento.isConnectionError = false;
      cancelamento.mensagem = "A requisicao foi cancelada.";
    } else if (axiosError.response) {
      axiosError.tipoErro = "http";
      const dados = axiosError.response.data;

      if (
        typeof dados === "object" &&
        dados !== null &&
        "mensagem" in dados &&
        typeof dados.mensagem === "string"
      ) {
        axiosError.mensagem = dados.mensagem;
        axiosError.message = dados.mensagem;
      }

      axiosError.isConnectionError = false;
    } else if (
      axiosError.code === "ECONNABORTED" ||
      axiosError.code === "ETIMEDOUT"
    ) {
      axiosError.tipoErro = "timeout";
      axiosError.isConnectionError = true;
      axiosError.mensagem = "A requisicao excedeu o tempo limite.";
    } else {
      axiosError.tipoErro = "connection";
      axiosError.isConnectionError = true;
      axiosError.mensagem = "Nao foi possivel conectar ao servidor.";
    }

    return Promise.reject(axiosError);
  },
);

export default api;
