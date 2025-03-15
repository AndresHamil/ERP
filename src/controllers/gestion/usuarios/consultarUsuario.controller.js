import { pool } from "../../../db.js";
import * as methods from "../../../utils/methods.js";

export const consultarUsuario = async (req, res) => {
    const { id } = req.body;
    const tableDb = "usuarios";

    let successRes = true,
        messageRes = "Consulta exitosa",
        errorRes = null,
        dataRes = null;

    try {
        // ------------------------------------------------------- [VALIDAR CONTENIDO]
        methods.validarRequerido(id, "El", "id");
        // ------------------------------------------------------- [VALIDAR TIPO DATO]
        methods.validarTipoDato(id, "El", "id", "int");

        const queryConsulta = `
            SELECT 
                usuarios.id,
                usuarios.nombre,
                usuarios.apellido,
                usuarios.usuario,
                usuarios.email,
                usuarios.telefono,
                sucursales.nombre AS sucursal,
                usuarios.fk_sucursal_id AS fkSucursalId,
                departamentos.nombre AS departamento,
                usuarios.fk_departamento_id AS fkDepartamentoId,
                perfiles.nombre AS perfil,
                usuarios.fk_perfil_id AS fkPerfilId,
                usuarios.estado,
                usuarios.sesion,
                usuarios.fecha_registro AS fechaRegistro,
                usuarios.fecha_actualizacion AS fechaActualizacion
            FROM 
                ${tableDb}
            INNER JOIN 
                sucursales ON usuarios.fk_sucursal_id = sucursales.id
            INNER JOIN
                departamentos ON usuarios.fk_departamento_id = departamentos.id
            INNER JOIN 
                perfiles ON usuarios.fk_perfil_id = perfiles.id
            WHERE usuarios.id = ?
        `;
        const queryParamsConsulta = [id];

        const [result] = await pool.query(queryConsulta, queryParamsConsulta);

        if (result.length === 0) {
            messageRes = "No se encontraron registros";
        } else {
            dataRes = result.map((usuario) => {
                return {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    usuario: usuario.usuario,
                    email: usuario.email,
                    telefono: usuario.telefono,
                    sucursal: usuario.sucursal,
                    fkSucursalId: usuario.fkSucursalId,
                    departamento: usuario.departamento,
                    fkDepartamentoId: usuario.fkDepartamentoId,
                    perfil: usuario.perfil,
                    fkPerfilId: usuario.fkPerfilId,
                    fechaRegistro: methods.formatearFecha(usuario.fechaRegistro),
                    fechaActualizacion: methods.formatearFecha(usuario.fechaActualizacion),
                    estado: usuario.estado === 1 ? true : false,
                    sesion: usuario.sesion === 1 ? true : false
                };
            });
        }
    } catch (error) {
        // ------------------------------------------------------- [CAPTURAR ERRORES]
        successRes = false;
        messageRes = "Ocurrió un error en el servidor";
        errorRes = error.message;
        if (error.customMessage) {
            messageRes = error.customMessage; 
        }
    }
    // ------------------------------------------------------- [RESPUESTA DEL SERIVODR]
    const response = {
        success: successRes,
        message: messageRes,
        error: errorRes,
        data: dataRes,
    };
    
    res.json(response);
};
