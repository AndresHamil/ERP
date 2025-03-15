import { pool } from "../../../db.js";
import * as methods from "../../../utils/methods.js";

export const consultarUsuariosFiltros = async (req, res) => {
    let { 
        id = null, 
        nombre = null, 
        apellido = null, 
        usuario = null, 
        email = null, 
        telefono = null, 
        sucursal = null, 
        fkSucursalId = null, 
        departamento = null, 
        fkDepartamentoId = null, 
        perfil = null, 
        fkPerfilId = null, 
        fechaRegistro = null,
        fechaActualizacion = null,
        estado = null, 
        sesion = null 
    } = req.body ?? {};

    const tableDb = "usuarios";

    let successRes = true,
        messageRes = "Consulta exitosa",
        errorRes = null,
        dataRes = null,
        totalCountRes = null,
        resultConutRes = null

    try {
        // ------------------------------------------------------- [VALIDAR TIPO DATO]
        methods.validarTipoDato(id, "El", "id", "int");
        methods.validarTipoDato(nombre, "El", "nombre", "string");
        methods.validarTipoDato(apellido, "El", "apellido", "string");
        methods.validarTipoDato(usuario, "El", "usuario", "string");
        methods.validarTipoDato(email, "El", "email", "string");
        methods.validarTipoDato(telefono, "El", "telefono", "string");
        methods.validarTipoDato(sucursal, "La", "sucursal", "string");
        methods.validarTipoDato(fkSucursalId, "El", "fkSucursalId", "int");
        methods.validarTipoDato(departamento, "El", "departamento", "string");
        methods.validarTipoDato(fkDepartamentoId, "El", "fkDepartamentoId", "int");
        methods.validarTipoDato(perfil, "El", "perfil", "string");
        methods.validarTipoDato(fkPerfilId, "El", "fkPerfilId", "int");
        methods.validarTipoDato(fechaRegistro, "La", "fechaRegistro", "string");
        methods.validarTipoDato(fechaActualizacion, "La", "fechaActualizacion", "string");
        methods.validarTipoDato(estado, "El", "estado", "bool");
        methods.validarTipoDato(sesion, "La", "sesion", "bool");
        // ------------------------------------------------------- [LIMPIAR CONTENIDO]
        nombre = methods.limpiarEspacios(nombre);
        apellido = methods.limpiarEspacios(apellido);
        usuario = methods.limpiarEspacios(usuario);
        email = methods.limpiarEspacios(email);
        telefono = methods.limpiarEspacios(telefono);
        sucursal = methods.limpiarEspacios(sucursal);
        departamento = methods.limpiarEspacios(departamento);
        perfil = methods.limpiarEspacios(perfil);
        
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
            conditions.push(`departamentos.id = ?`);
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
            resultConutRes = 0;
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
                estado: usuario.estado === 1 ? true : false,
                sesion: usuario.sesion === 1 ? true : false
            }));

            resultConutRes = dataRes.length; 
        }

        const [[{ totalCount: count }]] = await pool.query(`SELECT COUNT(*) AS totalCount FROM ${tableDb};`);
        
        totalCountRes = count;
        
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
        totalCount: totalCountRes,
        resultConut: resultConutRes
    };
    
    res.json(response);
};
