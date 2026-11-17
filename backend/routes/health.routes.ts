import {Router} from "express";

export default class HealthRoutes {
    static #instance : HealthRoutes | null = null;
    readonly #routes : Router = Router();

    public static obterInstancia () {
        if(HealthRoutes.#instance === null){
            HealthRoutes.#instance = new HealthRoutes();
        }

        return HealthRoutes.#instance;
    }

    private constructor (){
        this.definirRotas();
    }

    private definirRotas () : void {
        this.#routes.get("/", (req,res,next) => {
           res.status(200).json({
                messagem: "A aplicação está funcional" 
           })
        })
    }

    public getRoutes() : Router {
        return this.#routes;
    }
}