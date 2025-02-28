// ----------------------------------------------------- [ IMPORTACIONES ]
import express from "express";
import * as rutes from "./routes/index.js";
import {
    PORT
} from './config.js';
// ----------------------------------------------------- [ LIBRERIAS]
const app = express()
app.use(express.json())
// ----------------------------------------------------- [ APIS ]
// --- [ SISTEMAS ]
app.use(rutes.modulosRouter)
app.use(rutes.procesosRouter)
// --- [ GESTION ]
app.use(rutes.perfilesRouter)
app.use(rutes.sucursalesRouter)
app.use(rutes.departamentosRouter)
app.use(rutes.usuariosRouter)
// --- [ OTROS ]
app.use(rutes.sesionesRouter)
// ----------------------------------------------------- [ SALIDA DE CONSOLA ]
app.listen(PORT) 
console.log("Running server on port: ", PORT)