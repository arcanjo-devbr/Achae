import {instanciaTypeOrm} from "./config/Components.config";
import { portaServidor } from "./config/variaveisAmbiente.env";
import { instanciaApp } from "./server/Components.server";


(async () => {
    try{
        await instanciaTypeOrm.abrirConexao();
        instanciaApp.listen(portaServidor, () => {
            console.log(`Servidor iniciado na porta ${portaServidor}`);
        });
    }catch(erro){
        console.error("Falha ao inicializar a aplicação:", erro);
        process.exit(1);
    }
})()

