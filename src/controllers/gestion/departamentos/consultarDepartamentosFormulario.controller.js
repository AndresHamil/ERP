import { pool } from "../../../db.js";

export const consultarDepartamentosFormulario = async (req, res) => {
    const { nombre } = req.body;

    const tableDb = "departamentos";

    let successRes = true,
        messageRes = "Consulta exitosa",
        errorRes = null,
        dataRes = null;

    try {
        // Construir la consulta con la condición de estado
        let query = `
            SELECT 
                departamentos.id,
                departamentos.nombre
            FROM ${tableDb}
            WHERE departamentos.estado = 1
        `;
        const queryParams = [];

        if (nombre) {
            query += ` AND departamentos.nombre LIKE ?`;
            queryParams.push(`%${nombre}%`);
        }

        query += ` ORDER BY departamentos.nombre ASC LIMIT 20`;

        const [result] = await pool.query(query, queryParams);

        if (result.length === 0) {
            messageRes = "No se encontraron registros";
        } else {
            dataRes = result.map((departamento) => {
                return {
                    id: departamento.id,
                    nombre: departamento.nombre
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
