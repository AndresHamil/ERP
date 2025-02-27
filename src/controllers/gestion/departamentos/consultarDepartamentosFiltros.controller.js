import { pool } from "../../../db.js";
import * as methods from "../../../utils/methods.js";

export const consultarDepartamentosFiltros = async (req, res) => {
    const { id, nombre, descripcion, estado } = req.body;

    const tableDb = "departamentos";

    let successRes = true,
        messageRes = "Consulta exitosa",
        errorRes = null,
        dataRes = null;

    try {
        // Base de la consulta
        let query = `
            SELECT 
                departamentos.id,
                departamentos.nombre,
                departamentos.descripcion,
                departamentos.fecha_registro AS fechaRegistro,
                departamentos.fecha_actualizacion AS fechaActualizacion,
                departamentos.estado
            FROM 
                ${tableDb}
        `;

        const queryParams = [];
        const conditions = [];

        if (id != null) {
            conditions.push(`departamentos.id = ?`);
            queryParams.push(id);
        }
        if (nombre) {
            conditions.push(`departamentos.nombre LIKE ?`);
            queryParams.push(`%${nombre}%`);
        }
        if (descripcion) {
            conditions.push(`departamentos.descripcion LIKE ?`);
            queryParams.push(`%${descripcion}%`);
        }
        if (estado != null) {
            conditions.push(`departamentos.estado = ?`);
            queryParams.push(estado);
        }

        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(" AND ");
        }

        query += ` ORDER BY departamentos.nombre ASC LIMIT 20`;

        const [result] = await pool.query(query, queryParams);

        if (result.length === 0) {
            messageRes = "No se encontraron registros";
        } else {
            dataRes = result.map((departamento) => ({
                id: departamento.id,
                nombre: departamento.nombre,
                descripcion: departamento.descripcion,
                fechaRegistro: methods.formatearFecha(departamento.fechaRegistro),
                fechaActualizacion: methods.formatearFecha(departamento.fechaActualizacion),
                estado: departamento.estado === 1 ? true : false      
            }));
        }
        
    } catch (error) {
        successRes = false;
        messageRes = "Error en el servidor";
        errorRes = error.message;
    }

    const response = {
        success: successRes,
        message: messageRes,
        error: errorRes,
        data: dataRes,
    };
    
    res.json(response);
};
