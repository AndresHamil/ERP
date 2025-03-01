import { pool } from "../../../db.js";

export const consultarUsuariosFormulario = async (req, res) => {
    const { 
        nombre,
        fkSucursalId,
        fkDepartamentoId,
        fkPerfilId
    } = req.body;

    

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
                usuarios.usuario,
                usuarios.email,
                usuarios.telefono,
                sucursales.nombre AS sucursal,
                departamentos.nombre AS departamento,
                perfiles.nombre AS perfil,
                usuarios.estado,
                usuarios.sesion,
                usuarios.fecha_registro AS fechaRegistro,
                usuarios.fecha_actualizacion AS fechaActualizacion
            FROM ${tableDb}
            INNER JOIN 
                sucursales ON usuarios.fk_sucursal_id = sucursales.id
            INNER JOIN
                departamentos ON usuarios.fk_departamento_id = departamentos.id
            INNER JOIN 
                perfiles ON usuarios.fk_perfil_id = perfiles.id
            WHERE usuarios.estado = 1
        `;
        const queryParams = [];

        if (nombre) {
            query += ` AND (usuarios.nombre LIKE ? OR usuarios.apellido LIKE ?)`;
            queryParams.push(`%${nombre}%`, `%${nombre}%`);
        }
        if (fkSucursalId) {
            query += ` AND sucursales.id = ?`;
            queryParams.push(fkSucursalId);
        }
        if (fkDepartamentoId) {
            query += ` AND departamentos.id = ?`;
            queryParams.push(fkDepartamentoId);
        }
        if (fkPerfilId) {
            query += ` AND perfiles.id = ?`;
            queryParams.push(fkPerfilId);
        }

        query += ` ORDER BY usuarios.nombre ASC LIMIT 20`;

        const [result] = await pool.query(query, queryParams);

        if (result.length === 0) {
            messageRes = "No se encontraron registros";
        } else {
            dataRes = result.map((usuario) => {
                return {
                    id: usuario.id,
                    nombre: `${usuario.nombre} ${usuario.apellido}`,
                    sucursal: usuario.sucursal,
                    departamento: usuario.departamento,
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
