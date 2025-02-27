import { pool } from "../../../db.js";
import * as methods from "../../../utils/methods.js";

export const consultarSucursalesFiltros = async (req, res) => {
    const { id, nombre, descripcion, estado } = req.body;

    const tableDb = "sucursales";

    let successRes = true,
        messageRes = "Consulta exitosa",
        errorRes = null,
        dataRes = null;

    try {
        let query = `
            SELECT 
                sucursales.id,
                sucursales.nombre,
                sucursales.descripcion,
                sucursales.fecha_registro AS fechaRegistro,
                sucursales.fecha_actualizacion AS fechaActualizacion,
                sucursales.estado
            FROM 
                ${tableDb}
        `;

        const queryParams = [];
        const conditions = [];

        if (id != null) {
            conditions.push(`sucursales.id = ?`);
            queryParams.push(id);
        }
        if (nombre) {
            conditions.push(`sucursales.nombre LIKE ?`);
            queryParams.push(`%${nombre}%`);
        }
        if (descripcion) {
            conditions.push(`sucursales.descripcion LIKE ?`);
            queryParams.push(`%${descripcion}%`);
        }
        if (estado != null) {
            conditions.push(`sucursales.estado = ?`);
            queryParams.push(estado);
        }

        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(" AND ");
        }

        query += ` ORDER BY sucursales.nombre ASC LIMIT 20`;

        const [result] = await pool.query(query, queryParams);

        if (result.length === 0) {
            messageRes = "No se encontraron registros";
        } else {
            dataRes = result.map((sucursal) => ({
                id: sucursal.id,
                nombre: sucursal.nombre,
                descripcion: sucursal.descripcion,
                fechaRegistro: methods.formatearFecha(sucursal.fechaRegistro),
                fechaActualizacion: methods.formatearFecha(sucursal.fechaActualizacion),
                estado: sucursal.estado === 1 ? true : false      
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
