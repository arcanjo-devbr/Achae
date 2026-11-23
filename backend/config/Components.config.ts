import TypeOrm from "./AppDataSource";
import Env from "./Env";



const instanciaTypeOrm = TypeOrm.obterInstancia();
const instanciaEnv = Env.obterInstancia();


export {
    instanciaTypeOrm,
    instanciaEnv
}

