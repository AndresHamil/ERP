import { pool } from "../../../db.js";
import * as methods from "../../../utils/methods.js";

export const consultarUsuarios = async (req, res) => {
    const tableDb = "usuarios";

    let successRes = true,
        messageRes = "Consulta exitosa",
        errorRes = null,
        dataRes = null,
        totalCountRes = 0;

    try {
        const [dataResult] = await pool.query(`
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
            FROM 
                ${tableDb}
            INNER JOIN 
                sucursales ON usuarios.fk_sucursal_id = sucursales.id
            INNER JOIN
                departamentos ON usuarios.fk_departamento_id = departamentos.id
            INNER JOIN 
                perfiles ON usuarios.fk_perfil_id = perfiles.id
            ORDER BY usuarios.id DESC
            LIMIT 20;
        `);

        if (dataResult.length === 0) {
            messageRes = "No se encontraron registros";
            totalCountRes = 0;
        } else {
            dataRes = dataResult.map((usuario) => {
                return {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    usuario: usuario.usuario,
                    email: usuario.email,
                    telefono: usuario.telefono,
                    sucursal: usuario.sucursal,
                    departamento: usuario.departamento,
                    perfil: usuario.perfil,
                    fechaRegistro: methods.formatearFecha(usuario.fechaRegistro),
                    fechaActualizacion: methods.formatearFecha(usuario.fechaActualizacion),
                    estado: usuario.estado === 1 ? true : false,
                    sesion: usuario.sesion === 1 ? true : false
                };
            });
        }

        const [[{ totalCount: count }]] = await pool.query(`SELECT COUNT(*) AS totalCount FROM ${tableDb};`);
        
        totalCountRes = count;

    } catch (error) {
        successRes = false
        messageRes = "Ocurrió un error en el servidor";
        errorRes = error.message;
    }

    res.json({
        success: successRes,
        message: messageRes,
        error: errorRes,
        data: dataRes,
        totalCount: totalCountRes
    });
};
