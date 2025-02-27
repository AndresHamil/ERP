import { pool } from "../../../db.js";
import * as methods from "../../../utils/methods.js";

export const registrarDepartamento = async (req, res) => {
    const { nombre, descripcion } = req.body;

    const tableDb = "departamentos";

    let successRes = true,
        messageRes = "Registro exitoso",
        errorRes = null,
        dataRes = null;

    try {
        const queryInsercion = `
            INSERT INTO ${tableDb}(nombre, descripcion) 
            VALUES (?, ?)
        `;
        const queryParamsInsercion = [nombre,descripcion];

        let [result] = await pool.query(queryInsercion, queryParamsInsercion);

        const id = result.insertId;


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

        [result] = await pool.query(querySeleccion, queryParamsSeleccion);


        dataRes = result.map((departamento) => {
            return {
                id: departamento.id,
                nombre: departamento.nombre,
                descripcion: departamento.descripcion,
                fechaRegistro: methods.formatearFecha(departamento.fechaRegistro),
                fechaActualizacion: methods.formatearFecha(departamento.fechaActualizacion),
                estado: departamento.estado === 1 ? true : false      
            };
        });

    } catch (error) {
        successRes = false;
        errorRes = error.message;
        dataRes = null;
        if (error.code === 'ER_DUP_ENTRY') {
            messageRes = "El departamento ya existe";
        } else {
            messageRes = "Error en el servidor";
        }
    }

    const response = {
        success: successRes,
        message: messageRes,
        error: errorRes,
        data: dataRes,
    };

    res.json(response);
};