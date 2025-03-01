import { pool } from "../../../db.js";
import * as methods from "../../../utils/methods.js";

export const consultarUsuariosFiltros = async (req, res) => {
    const { 
        id, 
        nombre, 
        apellido, 
        usuario, 
        email, 
        telefono, 
        sucursal, 
        fkSucursalId, 
        departamento, 
        fkDepartamentoId, 
        perfil, 
        fkPerfilId, 
        fechaRegistro,
        fechaActualizacion,
        estado, 
        sesion 
    } = req.body;

    const tableDb = "usuarios";

    let successRes = true,
        messageRes = "Consulta exitosa",
        errorRes = null,
        dataRes = null;

    try {
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

        if (id) {
            conditions.push(`usuarios.id = ?`);
            queryParams.push(id);
        }
        if (nombre) {
            conditions.push(`usuarios.nombre LIKE ?`);
            queryParams.push(`%${nombre}%`);
        }
        if (apellido) {
            conditions.push(`usuarios.apellido LIKE ?`);
            queryParams.push(`%${apellido}%`);
        }
        if (usuario) {
            conditions.push(`usuarios.usuario LIKE ?`);
            queryParams.push(`%${usuario}%`);
        }
        if (email) {
            conditions.push(`usuarios.email LIKE ?`);
            queryParams.push(`%${email}%`);
        }
        if (telefono) {
            conditions.push(`usuarios.telefono LIKE ?`);
            queryParams.push(`%${telefono}%`);
        }
        if (sucursal) {
            conditions.push(`sucursales.nombre LIKE ?`);
            queryParams.push(`%${sucursal}%`);
        }
        if (fkSucursalId) {
            conditions.push(`sucursales.id = ?`);
            queryParams.push(fkSucursalId);
        }
        if (departamento) {
            conditions.push(`departamentos.nombre LIKE ?`);
            queryParams.push(`%${departamento}%`);
        }
        if (fkDepartamentoId) {
            conditions.push(`depatamento.id = ?`);
            queryParams.push(fkDepartamentoId);
        }
        if (perfil) {
            conditions.push(`perfiles.nombre LIKE ?`);
            queryParams.push(`%${perfil}%`);
        }
        if (fkPerfilId) {
            conditions.push(`perfiles.id = ?`);
            queryParams.push(fkPerfilId);
        }
        if (fechaRegistro) {
            conditions.push(`DATE(usuarios.fecha_registro) = ?`);
            queryParams.push(fechaRegistro);
        }
        if (fechaActualizacion) {
            conditions.push(`DATE(usuarios.fecha_actualizacion) = ?`);
            queryParams.push(fechaActualizacion);
        }
        if (sesion != null) {
            conditions.push(`usuarios.sesion = ?`);
            queryParams.push(sesion);
        }
        if (estado != null) {
            conditions.push(`usuarios.estado = ?`);
            queryParams.push(estado);
        }

        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(" AND ");
        }

        query += ` ORDER BY usuarios.nombre ASC LIMIT 20`;

        const [result] = await pool.query(query, queryParams);

        if (result.length === 0) {
            messageRes = "No se encontraron registros";
        } else {
            dataRes = result.map((usuario) => ({
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
                estado: usuario.estado === 1,
                sesion: usuario.sesion === 1
            }));
        }
        
    } catch (error) {
        successRes = false;
        messageRes = "Error en el servidor";
        errorRes = error.message;
    }

    res.json({
        success: successRes,
        message: messageRes,
        error: errorRes,
        data: dataRes,
    });
};
