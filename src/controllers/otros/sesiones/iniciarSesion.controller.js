import { pool } from "../../../db.js";
import * as methods from "../../../utils/methods.js"

export const iniciarSesion = async (req, res) => {
    // try {
    //     const [result] = await pool.query(`
    //         SELECT 
    //             *
    //         FROM sesiones 
    //         ORDER BY id DESC
    //         LIMIT 20;
    //     `);

    //     res.json({
    //         success: true,
    //         message: "Consulta exitosa",
    //         error: null, 
    //         data: result,
    //     });

    // } catch (error) {
    //     console.error("Error al consultar usuarios:", error);

    //     res.status(500).json({
    //         success: false,
    //         message: "Ocurrió un error en el servidor",
    //         error: error.message, 
    //     });
    // }
    methods.saludo();
    res.send("Entro")
};
