import { pool } from "../../../db.js";

export const consultarPerfilesFormulario = async (req, res) => {
    const { nombre } = req.body;

    const tableDb = "perfiles";

    let successRes = true,
        messageRes = "Consulta exitosa",
        errorRes = null,
        dataRes = null;

    try {
        // Construir la consulta con la condición de estado
        let query = `
            SELECT 
                perfiles.id,
                perfiles.nombre
            FROM ${tableDb}
            WHERE perfiles.estado = 1
        `;
        const queryParams = [];

        if (nombre) {
            query += ` AND perfiles.nombre LIKE ?`;
            queryParams.push(`${nombre}%`);
        }

        query += ` ORDER BY perfiles.nombre ASC LIMIT 20`;

        const [result] = await pool.query(query, queryParams);

        dataRes = result.length ? result : null;
    } catch (error) {
        successRes = false;
        messageRes = "Error en el servidor";
        errorRes = error.message;
    }

    const response = {
        success: successRes,
        message: messageRes,
        error: errorRes,
        data: dataRes,
    };
    res.json(response);
};
