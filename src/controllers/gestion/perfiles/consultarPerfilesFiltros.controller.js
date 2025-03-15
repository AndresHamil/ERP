import { pool } from "../../../db.js";

export const consultarPerfilesFiltros = async (req, res) => {
    const { id, nombre, descripcion, estado } = req.body;

    const tableDb = "perfiles";

    let successRes = true,
        messageRes = "Consulta exitosa",
        errorRes = null,
        dataRes = [];

    try {
        // Construir la consulta con la condición de estado
        let query = `
            SELECT 
                perfiles.id,
                perfiles.nombre, 
                perfiles.descripcion,
                perfiles.estado
            FROM ${tableDb}
        `;
        const queryParams = [];

        if (id != null) {
            query += ` AND perfiles.id = ?`;
            queryParams.push(id);
        }
        if (nombre) {
            query += ` AND perfiles.nombre LIKE ?`;
            queryParams.push(`${nombre}%`);
        }
        if (descripcion) {
            query += ` AND perfiles.descripcion LIKE ?`;
            queryParams.push(`%${descripcion}%`);
        }
        if (estado != null) {
            query += ` AND perfiles.estado = ?`;
            queryParams.push(estado);
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
