import { pool } from "../../../db.js";
import * as methods from "../../../utils/methods.js";

export const editarDepartamento = async (req, res) => {
    const { id, nombre, descripcion, estado } = req.body;
    const tableDb = "departamentos";

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Se requiere un ID.",
            error: null,
            data: null,
        });
    }

    let successRes = true,
        messageRes = "Edición exitosa",
        errorRes = null,
        dataRes = null;

    try {
        const queryActualizacion = `
            UPDATE ${tableDb} 
            SET 
                nombre = CASE 
                    WHEN ? IS NULL THEN nombre 
                    ELSE ? 
                END,
                descripcion = CASE 
                    WHEN ? IS NULL THEN descripcion 
                    WHEN ? = '' THEN NULL 
                    ELSE ? 
                END,
                estado = CASE 
                    WHEN ? IS NULL THEN estado 
                    ELSE ? 
                END
            WHERE id = ?
        `;
        const queryParamsActualizacion = [
            nombre, nombre, // Para nombre
            descripcion, descripcion, descripcion, // Para descripcion
            estado, estado, // Para estado
            id
        ];

        const [result] = await pool.query(queryActualizacion, queryParamsActualizacion);

        if (result.affectedRows) {
            const querySeleccion = `
                SELECT  
                    departamentos.id,
                    departamentos.nombre,
                    departamentos.descripcion,
                    departamentos.fecha_registro AS fechaRegistro,
                    departamentos.fecha_actualizacion AS fechaActualizacion,
                    departamentos.estado
                FROM ${tableDb} 
                WHERE departamentos.id = ?
            `;
            const queryParamsSeleccion = [id];

            const [updatedRecord] = await pool.query(querySeleccion, queryParamsSeleccion);

            dataRes = updatedRecord.map((departamento) => {
                return {
                    id: departamento.id,
                    nombre: departamento.nombre,
                    descripcion: departamento.descripcion,
                    fechaRegistro: methods.formatearFecha(departamento.fechaRegistro),
                    fechaActualizacion: methods.formatearFecha(departamento.fechaActualizacion),
                    estado: departamento.estado === 1 ? true : false      
                };
            });

        } else {
            successRes = false;
            messageRes = `El registro con id '${id}' no existe en la tabla '${tableDb}'.`;
            errorRes = `No record found for id '${id}' in table '${tableDb}'.`;
        }
    } catch (error) {
        successRes = false;
        errorRes = error.message;

        if (error.code === 'ER_DUP_ENTRY') {
            messageRes = "Ya existe un departamento con el mismo nombre.";
        } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            messageRes = "El departamento no existe";
        } else {
            messageRes = "Error en el servidor";
        }
    }

    res.json({
        success: successRes,
        message: messageRes,
        error: errorRes,
        data: dataRes,
    });
};
