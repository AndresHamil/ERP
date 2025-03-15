import { pool } from "../../../db.js";
import * as methods from "../../../utils/methods.js";


export const editarUsuario = async (req, res) => {

    let { 
        id = null, 
        nombre, 
        apellido = null,
        email = null,
        telefono = null,
        password = null, 
        fkSucursalId = null,
        fkDepartamentoId = null,
        fkPerfilId = null,
        estado = null, 
        sesion = null
    } = req.body ?? {};

    const tableDb = "usuarios";

    let successRes = true,
        messageRes = "Edición exitosa",
        errorRes = null,
        dataRes = null;

    try {
        // ------------------------------------------------------- [VALIDAR TIPO DATO]
        methods.validarTipoDato(id, "El", "id", "int");
        methods.validarTipoDato(nombre, "El", "nombre", "string");
        methods.validarTipoDato(apellido, "El", "apellido", "string");
        methods.validarTipoDato(email, "El", "email", "string");
        methods.validarTipoDato(telefono, "El", "telefono", "string");
        methods.validarTipoDato(password, "El", "password", "string");
        methods.validarTipoDato(fkSucursalId, "El", "fkSucursalId", "int");
        methods.validarTipoDato(fkDepartamentoId, "El", "fkDepartamentoId", "int");
        methods.validarTipoDato(fkPerfilId, "El", "fkPerfilId", "int");
        methods.validarTipoDato(estado, "El", "estado", "bool");
        methods.validarTipoDato(sesion, "La", "sesion", "bool");
        // ------------------------------------------------------- [VALIDAR CONTENIDO]
        methods.validarRequeridoEdicion(nombre, "El", "nombre");
        methods.validarRequeridoEdicion(apellido, "El", "apellido");
        methods.validarRequeridoEdicion(password, "El", "password");
        // ------------------------------------------------------- [VALIDAR TIPO CONTENIDO]
        methods.validarContenidoString(nombre, "El", "nombre");
        methods.validarContenidoString(apellido, "El", "apellido");
        // ------------------------------------------------------- [VALIDAR FORMATO CONTENIDO]
        methods.validarFormatoEmail(email);
        methods.validarFormatoTelefono(telefono);
        // ------------------------------------------------------- [LIMPIAR CONTENIDO]
        nombre = methods.limpiarEspacios(nombre);
        apellido = methods.limpiarEspacios(apellido);
        email = methods.limpiarEspacios(email);
        password = methods.limpiarEspacios(password);
        // ------------------------------------------------------- [CAPITALIZAR CONTENIDO]
        nombre = methods.capitalizarString(nombre);
        apellido = methods.capitalizarString(apellido);
        // ------------------------------------------------------- [GENERAR USUARIO EDICION]
        const usuario = await methods.generarUsuarioEdicion(id, nombre, apellido);
        // ------------------------------------------------------- [HASH PASSWORD]
        password = await methods.generarHash(password);
        // ------------------------------------------------------- [ACTUALIZAR REGISTRO]
        const queryActualizacion = `
            UPDATE ${tableDb} 
            SET 
                nombre = CASE 
                    WHEN ? IS NULL THEN nombre  
                    WHEN ? = '' THEN nombre 
                    ELSE ?  
                END,
                apellido = CASE 
                    WHEN ? IS NULL THEN apellido  
                    WHEN ? = '' THEN apellido 
                    ELSE ?   
                END,
                usuario = CASE 
                    WHEN ? IS NULL THEN usuario  
                    WHEN ? = '' THEN usuario 
                    ELSE ?  
                END,
                email = CASE 
                    WHEN ? IS NULL THEN email  
                    WHEN ? = '' THEN email 
                    ELSE ?   
                END,
                telefono = CASE 
                    WHEN ? IS NULL THEN telefono 
                    WHEN ? = '' THEN NULL 
                    ELSE ? 
                END,
                password = CASE 
                    WHEN ? IS NULL THEN password  
                    WHEN ? = '' THEN password 
                    ELSE ?   
                END,
                fk_sucursal_id = CASE
                    WHEN ? IS NULL THEN fk_sucursal_id  
                    WHEN ? = '' THEN fk_sucursal_id 
                    ELSE ? 
                END,
                fk_departamento_id = CASE
                    WHEN ? IS NULL THEN fk_departamento_id  
                    WHEN ? = '' THEN fk_departamento_id 
                    ELSE ? 
                END,
                fk_perfil_id = CASE
                    WHEN ? IS NULL THEN fk_perfil_id  
                    WHEN ? = '' THEN fk_perfil_id 
                    ELSE ? 
                END,
                estado = CASE 
                    WHEN ? IS NULL THEN estado 
                    ELSE ? 
                END,
                sesion = CASE 
                    WHEN ? IS NULL THEN sesion 
                    ELSE ? 
                END
            WHERE id = ?
        `;
        const queryParamsActualizacion = [
            nombre, nombre, nombre,
            apellido, apellido, apellido,
            usuario, usuario, usuario,
            email, email, email,
            telefono, telefono, telefono,
            password, password, password,
            fkSucursalId, fkSucursalId, fkSucursalId,
            fkDepartamentoId, fkDepartamentoId, fkDepartamentoId,
            fkPerfilId, fkPerfilId, fkPerfilId,
            estado, estado, 
            sesion, sesion,
            id
        ];
        const [result] = await pool.query(queryActualizacion, queryParamsActualizacion);
        // ------------------------------------------------------- [SELECCIONAR REGISTRO ACTUALIZADO]
        if (result.affectedRows) {
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

            const [updatedRecord] = await pool.query(queryConsulta, queryParamsConsulta);

            dataRes = updatedRecord.map((usuario) => {
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

        } else {
            successRes = false;
            messageRes = `El registro con id '${id}' no existe en la tabla '${tableDb}'.`;
            errorRes = `No record found for id '${id}' in table '${tableDb}'.`;
        }
    } catch (error) {
        // ------------------------------------------------------- [CAPTURAR ERRORES]
        successRes = false
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
