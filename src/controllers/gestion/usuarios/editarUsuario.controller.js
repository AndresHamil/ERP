import { pool } from "../../../db.js";
import * as methods from "../../../utils/methods.js";


export const editarUsuario = async (req, res) => {

    let { 
        id, 
        nombre, 
        apellido,
        usuario, 
        telefono,
        email,
        password, 
        fkSucursalId,
        fkDepartamentoId,
        fkPerfilId,
        estado, 
        sesion
    } = req.body;

    const tableDb = "usuarios";

    let successRes = true,
        messageRes = "Edición exitosa",
        errorRes = null,
        dataRes = null;

    try {
        // ------------------------------------------------------- [VALIDAR CONTENIDO]
        methods.validarRequerido(id, "El id es requerido", "id");
        methods.validarRequeridoEdicion(nombre, "El nombre es requerido", "nombre");
        methods.validarRequeridoEdicion(apellido, "El apellido es requerido", "apellido");
        methods.validarRequeridoEdicion(usuario, "El usuario es requerido", "usuario");
        methods.validarRequeridoEdicion(password, "El password es requerido", "password");
        // ------------------------------------------------------- [VALIDAR TIPO DATO]
        methods.validarTipoDato(id, "El id no tiene el formato adecuado", "id", "int");
        methods.validarTipoDato(nombre, "El nombre no tiene el formato adecuado", "nombre", "string");
        methods.validarTipoDato(apellido, "El apellido no tiene el formato adecuado", "apellido", "string");
        methods.validarTipoDato(usuario, "El usuario no tiene el formato adecuado", "usuario", "string");
        methods.validarTipoDato(telefono, "El telefono no tiene el formato adecuado", "telefono", "string");
        methods.validarTipoDato(email, "El email no tiene el formato adecuado", "email", "string");
        methods.validarTipoDato(password, "El password no tiene el formato adecuado", "password", "string");
        methods.validarTipoDato(fkSucursalId, "El fkSucursalId no tiene el formato adecuado", "fkSucursalId", "int");
        methods.validarTipoDato(fkDepartamentoId, "El fkDepartamentoId no tiene el formato adecuado", "fkDepartamentoId", "int");
        methods.validarTipoDato(fkPerfilId, "El fkPerfilId no tiene el formato adecuado", "fkPerfilId", "int");
        methods.validarTipoDato(estado, "El estado no tiene el formato adecuado", "estado", "bool");
        methods.validarTipoDato(sesion, "El sesion no tiene el formato adecuado", "sesion", "bool");
        // ------------------------------------------------------- [VALIDAR FORMATO CONTENIDO]
        methods.validarFormatoEmail(email);
        methods.validarFormatoTelefono(telefono);
        // ------------------------------------------------------- [LIMPIAR CONTENIDO]
        nombre = methods.limpiarEspacios(nombre);
        apellido = methods.limpiarEspacios(apellido);
        usuario = methods.limpiarEspacios(usuario);
        email = methods.limpiarEspacios(email);
        password = methods.limpiarEspacios(password);
        // ------------------------------------------------------- [CAPITALIZAR CONTENIDO]
        nombre = methods.capitalizarString(nombre);
        apellido = methods.capitalizarString(apellido);
        // ------------------------------------------------------- [HASH PASSWORD]
        password = await methods.generarHash(password);
        // ------------------------------------------------------- [ACTUALIZAR REGISTRO]
        const queryActualizacion = `
            UPDATE ${tableDb} 
            SET 
                nombre = CASE 
                    WHEN ? IS NULL THEN ? 
                    ELSE ? 
                END,
                apellido = CASE 
                    WHEN ? IS NULL THEN ? 
                    ELSE ? 
                END,
                telefono = CASE 
                    WHEN ? IS NULL THEN ? 
                    WHEN ? = '' THEN NULL 
                    ELSE ? 
                END,
                email = CASE 
                    WHEN ? IS NULL THEN email 
                    ELSE ? 
                END,
                estado = CASE 
                    WHEN ? IS NULL THEN estado 
                    ELSE ? 
                END
            WHERE id = ?
        `;
        const queryParamsActualizacion = [
            nombre, nombre, nombre,
            apellido, apellido, apellido,
            telefono, telefono, telefono, telefono,
            email, email,
            estado, estado, 
            id
        ];
        const [result] = await pool.query(queryActualizacion, queryParamsActualizacion);
        // ------------------------------------------------------- [SELECCIONAR REGISTRO ACTUALIZADO]
        if (result.affectedRows) {
            const [updatedRecord] = await pool.query(
                `SELECT * FROM ?? WHERE id = ?`,
                [tableDb, id]
            );
            dataRes = updatedRecord;
        } else {
            successRes = false;
            messageRes = `El registro con id '${id}' no existe en la tabla '${tableDb}'.`;
            errorRes = `No record found for id '${id}' in table '${tableDb}'.`;
        }
    } catch (error) {
        successRes = false
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
        } else {
            messageRes = "Error al registrar el usuario.";
        }
    }

    res.json({
        success: successRes,
        message: messageRes,
        error: errorRes,
        data: dataRes,
    });
};
