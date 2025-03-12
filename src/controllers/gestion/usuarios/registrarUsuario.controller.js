import { pool } from "../../../db.js";

import * as methods from "../../../utils/methods.js";

export const registrarUsuario = async (req, res) => {
    let { nombre, apellido, telefono, email, password, fkSucursalId, fkDepartamentoId,  fkPerfilId } = req.body;

    const tableDb = "usuarios";

    let successRes = true,
        messageRes = "Registro exitoso",
        errorRes = null,
        dataRes = null;

    try {
        // ------------------------------------------------------- [VALIDAR CONTENIDO]
        methods.validarRequerido(nombre, "El nombre es requerido", "Name is required.");
        methods.validarRequerido(apellido, "El apellido es requerido", "Last name is required.");
        methods.validarRequerido(email, "El correo electronico es requerido", "Email is required.");
        methods.validarRequerido(password, "La constraseña es requerida", "Password is required.");
        methods.validarRequerido(fkSucursalId, "La sucursal es requerida", "fkSucursalId is required.");
        methods.validarRequerido(fkDepartamentoId, "El departamento es requerido", "fkDepartamentoId is required.");
        methods.validarRequerido(fkPerfilId, "El perfil es requerido", "fkPerfilId is required.");
        methods.validarFormatoEmail(email);
        methods.validarFormatoTelefono(telefono);
        // ------------------------------------------------------- [LIMPIAR CONTENIDO]
        nombre = methods.limpiarEspacios(nombre);
        apellido = methods.limpiarEspacios(apellido);
        telefono = methods.limpiarEspacios(telefono);
        email = methods.limpiarEspacios(email);
        password = methods.limpiarEspacios(password);
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
            }  else {
                messageRes = "Error al registrar el usuario.";
            }
        } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            if (error.sqlMessage.includes("fk_sucursal_id")) {
                messageRes = "Lo sentimos, pero la sucursal seleccionada no existe.";
            } else if (error.sqlMessage.includes("fk_departamento_id")) {
                messageRes = "Lo sentimos, pero el departamento seleccionado no existe.";
            } else if (error.sqlMessage.includes("fk_perfil_id")) {
                messageRes = "Lo sentimos, pero el perfil seleccionado no existe.";
            }  else {
                messageRes = "Error al registrar el usuario.";
            }        
        } 
    }

    res.json({
        success: successRes,
        message: messageRes, 
        error: errorRes, 
        data: dataRes,
    });
};
