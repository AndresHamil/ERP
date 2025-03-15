import { pool } from "../../../db.js";
import * as methods from "../../../utils/methods.js";

export const registrarUsuario = async (req, res) => {
    let { 
        nombre = null, 
        apellido = null, 
        telefono = null, 
        email = null, 
        password = null, 
        fkSucursalId = null, 
        fkDepartamentoId = null,  
        fkPerfilId = null 
    } = req.body ?? {};

    const tableDb = "usuarios";

    let successRes = true,
        messageRes = "Registro exitoso",
        errorRes = null,
        dataRes = null;

    try {
        // ------------------------------------------------------- [VALIDAR TIPO DATO]
        methods.validarTipoDato(nombre, "El", "nombre", "string");
        methods.validarTipoDato(apellido, "El", "apellido", "string");
        methods.validarTipoDato(email, "El", "email", "string");
        methods.validarTipoDato(password, "La", "contraseña", "string");
        methods.validarTipoDato(telefono, "El", "telefono", "string");
        methods.validarTipoDato(fkSucursalId, "El", "fkSucursalId", "int");
        methods.validarTipoDato(fkDepartamentoId, "El", "fkDepartamentoId", "int");
        methods.validarTipoDato(fkPerfilId, "El", "fkPerfilId", "int");
        // ------------------------------------------------------- [VALIDAR CONTENIDO]
        methods.validarRequerido(nombre, "El", "nombre");
        methods.validarRequerido(apellido, "El", "apellido");
        methods.validarRequerido(email, "El", "email");
        methods.validarRequerido(password, "La", "contraseña");
        methods.validarRequerido(fkSucursalId, "El", "fkSucursalId");
        methods.validarRequerido(fkDepartamentoId, "El", "fkDepartamentoId");
        methods.validarRequerido(fkPerfilId, "El", "fkPerfilId");
        // ------------------------------------------------------- [VALIDAR TIPO CONTENIDO]
        methods.validarContenidoString(nombre, "El", "nombre");
        methods.validarContenidoString(apellido, "El", "apellido");
        // ------------------------------------------------------- [LIMPIAR CONTENIDO]
        nombre = methods.limpiarEspacios(nombre);
        apellido = methods.limpiarEspacios(apellido);
        telefono = methods.limpiarEspacios(telefono);
        email = methods.limpiarEspacios(email);
        password = methods.limpiarEspacios(password);
        // ------------------------------------------------------- [VALIDAR LONGITUD CONTENIDO]
        methods.validarLongitudString(nombre, "El", "nombre", 50);
        methods.validarLongitudString(apellido, "El", "apellido", 50);
        methods.validarLongitudString(email, "El", "email", 100);
        methods.validarLongitudString(password, "La", "contraseña", 30);
        methods.validarLongitudString(telefono, "El", "telefono", 10);
        // ------------------------------------------------------- [VALIDAR FORMATO CONTENIDO]
        methods.validarFormatoEmail(email);
        methods.validarFormatoTelefono(telefono);
        // ------------------------------------------------------- [CAPITALIZAR CONTENIDO]
        nombre = methods.capitalizarString(nombre);
        apellido = methods.capitalizarString(apellido);
        // ------------------------------------------------------- [GENERAR USUARIO]
        const usuario = methods.generarUsuario(nombre, apellido);
        // ------------------------------------------------------- [HASH PASSWORD]
        const hashedPassword = await methods.generarHash(password);

        const queryInsercion = `
            INSERT INTO ${tableDb} (nombre, apellido, telefono, usuario, email, password, fk_sucursal_id, fk_departamento_id, fk_perfil_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const paramsInsercion = [nombre, apellido, telefono, usuario, email, hashedPassword, fkSucursalId, fkDepartamentoId, fkPerfilId];

        let [result] = await pool.query(queryInsercion, paramsInsercion);

        const id = result.insertId;

        const querySeleccion = `
            SELECT 
                usuarios.id,
                usuarios.nombre,    
                usuarios.apellido,
                usuarios.usuario,  
                usuarios.password, 
                usuarios.email,
                usuarios.telefono,
                sucursales.nombre AS sucursal,
                usuarios.fk_sucursal_id,
                departamentos.nombre AS departamento,
                usuarios.fk_departamento_id,
                perfiles.nombre AS perfil,
                usuarios.fk_perfil_id,
                usuarios.estado,
                usuarios.sesion,
                usuarios.fecha_registro as fechaRegistro, 
                usuarios.fecha_actualizacion as fechaActualizacion 
            FROM 
                ${tableDb} usuarios
            INNER JOIN 
                sucursales ON usuarios.fk_sucursal_id = sucursales.id
            INNER JOIN
                departamentos ON usuarios.fk_departamento_id = departamentos.id
            INNER JOIN 
                perfiles ON usuarios.fk_perfil_id = perfiles.id
            WHERE usuarios.id = ?
        `;
        const paramsSeleccion = [id];

        [result] = await pool.query(querySeleccion, paramsSeleccion);

        dataRes = result.map((usuario) => {
            return {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                usuario: usuario.usuario,
                email: usuario.email,
                telefono: usuario.telefono,
                sucursal: usuario.sucursal,
                fkSucursalId: usuario.fk_sucursal_id,
                departamento: usuario.departamento, 
                fkDepartamentoId: usuario.fk_departamento_id,
                perfil: usuario.perfil,
                fkPerfilId: usuario.fk_perfil_id,
                fechaRegistro: methods.formatearFecha(usuario.fecha_registro),
                fechaActualizacion: methods.formatearFecha(usuario.fecha_actualizacion),
                estado: usuario.estado === 1 ? true : false,
                sesion: usuario.sesion === 1 ? true : false   
            };
        });

    } catch (error) {
        // ------------------------------------------------------- [CAPTURAR ERRORES]
        successRes = false;
        messageRes = "Ocurrió un error en el servidor";
        errorRes = error.message;

        if (error.customMessage) {
            messageRes = error.customMessage; 
        } else if (error.code === 'ER_DUP_ENTRY') {
            
            if (error.sqlMessage.includes("fk_sucursal_id")) {
                messageRes = "Lo sentimos pero ya existe un usuario con la misma infomacion.";
            } else if (error.sqlMessage.includes("email")) {
                messageRes = "Lo sentimos pero el correo ya está en uso por otro usuario.";
            }
        } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            if (error.sqlMessage.includes("fk_sucursal_id")) {
                messageRes = "Lo sentimos, pero la sucursal seleccionada no existe.";
            } else if (error.sqlMessage.includes("fk_departamento_id")) {
                messageRes = "Lo sentimos, pero el departamento seleccionado no existe.";
            } else if (error.sqlMessage.includes("fk_perfil_id")) {
                messageRes = "Lo sentimos, pero el perfil seleccionado no existe.";
            }     
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