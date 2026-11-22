import TypeOrm from "./AppDataSource";
import Env from "./Env";

export const instanciaEnv = Env.obterInstancia();
const instanciaTypeOrm = TypeOrm.obterInstancia();



export {
    instanciaTypeOrm
}

