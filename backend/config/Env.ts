import dotenv from "dotenv";
import { ValorStringPresenteAusente } from "./types/ValorStringPresenteAusente";
import { Environments } from "./const/Environments";

export default class Env {
    static #instancia : Env | null = null;
    readonly #variaveisAmbiente : NodeJS.ProcessEnv;
    readonly #processEnv : ValorStringPresenteAusente  = process.env.NODE_ENV;

    private configure () : void {
        if(this.#processEnv !== 'production'){
            dotenv.config({
                path: `.env.${this.#processEnv}`
            });
        }
    }
    
    private constructor () {
        if(!Environments.includes(this.#processEnv as typeof Environments[number])){
            throw new Error(`Ambiente de Execução Inválido ${this.#processEnv}`);
        }
       this.configure(); 
       this.#variaveisAmbiente = process.env;
    }

    static obterInstancia () : Env {
        if(Env.#instancia === null){
            Env.#instancia = new Env();
        }

        return Env.#instancia;
    }

    obterVariavelAmbiente(
        variavelAmbiente : string
    ) : ValorStringPresenteAusente {
        return this.#variaveisAmbiente[variavelAmbiente];
    }

}