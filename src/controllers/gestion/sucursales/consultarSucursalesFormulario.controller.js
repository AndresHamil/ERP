import { pool } from "../../../db.js";

export const consultarSucursalesFormulario = async (req, res) => {
    const { nombre } = req.body;

    const tableDb = "sucursales";

    let successRes = true,
        messageRes = "Consulta exitosa",
        errorRes = null,
        dataRes = null;

    try {
        // Construir la consulta con la condición de estado
        let query = `
            SELECT 
                sucursales.id,
                sucursales.nombre
            FROM ${tableDb}
            WHERE sucursales.estado = 1
        `;
        const queryParams = [];

        if (nombre) {
            query += ` AND sucursales.nombre LIKE ?`;
            queryParams.push(`%${nombre}%`);
        }

        query += ` ORDER BY sucursales.nombre ASC LIMIT 20`;

        const [result] = await pool.query(query, queryParams);

        if (result.length === 0) {
            messageRes = "No se encontraron registros";
        } else {
            dataRes = result.map((sucursal) => {
                return {
                    id: sucursal.id,
                    nombre: sucursal.nombre
                };
            });
        }
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
