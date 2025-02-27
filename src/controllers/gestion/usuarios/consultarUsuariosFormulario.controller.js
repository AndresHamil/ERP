import { pool } from "../../../db.js";

export const consultarUsuariosFormulario = async (req, res) => {
    const { nombre } = req.body;

    const tableDb = "usuarios";

    let successRes = true,
        messageRes = "Consulta exitosa",
        errorRes = null,
        dataRes = null;

    try {
        // Construir la consulta con la condición de estado
        let query = `
            SELECT 
                usuarios.id,
                usuarios.nombre, 
                usuarios.apellido,
                perfiles.nombre AS perfil
            FROM ${tableDb}
            INNER JOIN perfiles ON usuarios.fk_perfil_id = perfiles.id
            WHERE usuarios.estado = 1
        `;
        const queryParams = [];

        if (nombre) {
            query += ` AND (usuarios.nombre LIKE ? OR usuarios.apellido LIKE ?)`;
            queryParams.push(`%${nombre}%`, `%${nombre}%`);
        }

        query += ` ORDER BY usuarios.nombre ASC LIMIT 20`;

        const [result] = await pool.query(query, queryParams);

        if (result.length === 0) {
            messageRes = "No se encontraron registros";
        } else {
            dataRes = result.map((usuario) => {
                return {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    perfil: usuario.perfil,
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
