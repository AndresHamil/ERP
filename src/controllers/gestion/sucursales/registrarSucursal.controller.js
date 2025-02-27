import { pool } from "../../../db.js";
import * as methods from "../../../utils/methods.js";

export const registrarSucursal = async (req, res) => {
    let { nombre, descripcion } = req.body;

    const tableDb = "sucursales";

    

    let successRes = true,
        messageRes = "Registro exitoso",
        errorRes = null,
        dataRes = null;

    try {
        // ------------------------------------------------------- [VALIDAR CONTENIDO]
        methods.validarRequerido(nombre, "El nombre es requerido", "Name is required.");
        // ------------------------------------------------------- [VALIDAR FORMATO]
        // ------------------------------------------------------- [LIMPIAR CONTENIDO]
        nombre = methods.limpiarEspacios(nombre);
        descripcion = methods.limpiarEspacios(descripcion);
        // ------------------------------------------------------- [CAPITALIZAR CONTENIDO]
        nombre = methods.capitalizarString(nombre);
        descripcion = methods.capitalizarString(descripcion);

        console.log(descripcion);

        const queryInsercion = `
            INSERT INTO ${tableDb} (nombre, descripcion) 
            VALUES (?, ?)
        `;
        const paramsInsercion = [nombre, descripcion];

        let [result] = await pool.query(queryInsercion, paramsInsercion);
        const id = result.insertId;

        const querySeleccion = `
            SELECT 
                sucursales.id,
                sucursales.nombre,
                sucursales.descripcion,
                sucursales.fecha_registro AS fechaRegistro,
                sucursales.fecha_actualizacion AS fechaActualizacion,
                sucursales.estado
            FROM ${tableDb}
            WHERE sucursales.id = ?
        `;
        const paramsSeleccion = [id];

        [result] = await pool.query(querySeleccion, paramsSeleccion);

        dataRes = result.map((sucursal) => {
            return {
                id: sucursal.id,
                nombre: sucursal.nombre,
                descripcion: sucursal.descripcion,
                fechaRegistro: methods.formatearFecha(sucursal.fechaRegistro),
                fechaActualizacion: methods.formatearFecha(sucursal.fechaActualizacion),
                estado: sucursal.estado === 1 ? true : false   
            };
        });

    } catch (error) {
        successRes = false;
        errorRes = error.message;

        if (error.customMessage) {
            messageRes = error.customMessage; 
        } else if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes("sucursales.nombre")) {
                messageRes = "Ya existe unsa sucursal con el mismo nombre.";
            } 
        }  else {
            messageRes = "Error en el servidor.";
        }
    }

    res.json({
        success: successRes,
        message: messageRes, 
        error: errorRes, 
        data: dataRes,
    });
};
