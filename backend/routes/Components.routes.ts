import { Router } from "express";
import HealthRoutes from "./health.routes";

const healthRoutes 
        : Router 
            = HealthRoutes
                .obterInstancia()
                .getRoutes();


export {
    healthRoutes
}                    