import { instanciaEnv } from "./Components.config";

const portaServidor = instanciaEnv.obterVariavelAmbiente("PORT");

export {
    portaServidor
}