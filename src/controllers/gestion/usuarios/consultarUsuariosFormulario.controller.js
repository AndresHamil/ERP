import { pool } from "../../../db.js";
import * as methods from "../../../utils/methods.js";

export const consultarUsuariosFormulario = async (req, res) => {
    let { 
        nombre = null, 
        fkSucursalId = null, 
        fkDepartamentoId = null, 
        fkPerfilId = null, 
    } = req.body ?? {};

    const tableDb = "usuarios";

    let successRes = true,
        messageRes = "Consulta exitosa",
        errorRes = null,
        dataRes = null;

    try {
        // ------------------------------------------------------- [VALIDAR TIPO DATO]
        methods.validarTipoDato(nombre, "El nombre no tiene el formato adecuado", "nombre", "string");
        methods.validarTipoDato(fkSucursalId, "El fkSucursalId no tiene el formato adecuado", "fkSucursalId", "int");
        methods.validarTipoDato(fkDepartamentoId, "El fkDepartamentoId no tiene el formato adecuado", "fkDepartamentoId", "int");
        methods.validarTipoDato(fkPerfilId, "El fkPerfilId no tiene el formato adecuado", "fkPerfilId", "int");
        // ------------------------------------------------------- [LIMPIAR CONTENIDO]
        nombre = methods.limpiarEspacios(nombre);

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
        `;

        const queryParams = [];
        const conditions = [];


        if (nombre) {
            conditions.push(`(usuarios.nombre LIKE ? OR usuarios.apellido LIKE ?)`);
            queryParams.push(`%${nombre}%`, `%${nombre}%`);
        }
        if (fkSucursalId) {
            conditions.push(`sucursales.id = ?`);
            queryParams.push(fkSucursalId);
        }
        if (fkDepartamentoId) {
            conditions.push(`departamentos.id = ?`);
            queryParams.push(fkDepartamentoId);
        }
        if (fkPerfilId) {
            conditions.push(`perfiles.id = ?`);
            queryParams.push(fkPerfilId);
        }
        conditions.push(`usuarios.estado = 1`);
        query += ` WHERE ` + conditions.join(" AND ");
        query += ` ORDER BY usuarios.nombre ASC LIMIT 20`;

        const [result] = await pool.query(query, queryParams);

        if (result.length === 0) {
            messageRes = "No se encontraron registros";
        } else {
            dataRes = result.map((usuario) => ({
                id: usuario.id,
                nombre: `${usuario.nombre} ${usuario.apellido}`,
                sucursal: usuario.sucursal,
                departamento: usuario.departamento,
                perfil: usuario.perfil,

            }));
        }
        
    } catch (error) {
        successRes = false
        messageRes = "Ocurrió un error en el servidor";
        errorRes = error.message;

        if (error.customMessage) {
            messageRes = error.customMessage;       
        } 
    }

    const response = {
        success: successRes,
        message: messageRes,
        error: errorRes,
        data: dataRes,
    };
    
    res.json(response);
};
