import { DataSource } from "typeorm";
import { ENTITY_CLASSES } from "../entities";
import { ReadOnlyEntitySubscriber } from "../entities/ReadOnlyEntitySubscriber";
import Env from "./Env";

Env.obterInstancia();

export const appDataSource = new DataSource({
    type: "postgres",
    synchronize: false,
    url: process.env.DATABASE_URL,
    entities: [...ENTITY_CLASSES],
    subscribers: [ReadOnlyEntitySubscriber],
    migrations: ["config/migrations/*.ts"]
});

export default class TypeOrm {
    static #InstanceTypeOrm : TypeOrm | null = null;
    readonly #dataSource : DataSource;

    private constructor(){
        this.#dataSource = appDataSource;
    }

    static obterInstancia() : TypeOrm {
        if(TypeOrm.#InstanceTypeOrm === null){
            TypeOrm.#InstanceTypeOrm = new TypeOrm();
        }

        return TypeOrm.#InstanceTypeOrm; 
    }

    async abrirConexao() : Promise<void> {
        if(!this.#dataSource.isInitialized){
            await this.#dataSource.initialize();
        }
    }

    async fecharConexao(): Promise<void> {
        if(this.#dataSource.isInitialized){
            await this.#dataSource.destroy();
        }
    }

    obterDataSource () : DataSource {
        return this.#dataSource;
    }

}