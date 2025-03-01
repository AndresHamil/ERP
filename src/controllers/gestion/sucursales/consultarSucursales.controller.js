import { pool } from "../../../db.js";
import * as methods from "../../../utils/methods.js";

export const consultarSucursales = async (req, res) => {
    const tableDb = "sucursales"; 


    console.log("Consultar sucursales");

    let successRes = true,
        messageRes = "Consulta exitosa",
        errorRes = null,
        dataRes = null,
        totalCount = 0;

    try {
        const [result] = await pool.query(`
            SELECT 
                sucursales.id,
                sucursales.nombre,
                sucursales.descripcion,
                sucursales.fecha_registro AS fechaRegistro,
                sucursales.fecha_actualizacion AS fechaActualizacion,
                sucursales.estado
            FROM 
                ${tableDb}
            ORDER BY sucursales.id DESC
            LIMIT 20;
        `);

        if (result.length === 0) {
            messageRes = "No se encontraron registros";
        } else {
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
        }

        const [[{ totalCount: count }]] = await pool.query(`SELECT COUNT(*) AS totalCount FROM ${tableDb};`);
        
        totalCount = count;

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error en el servidor",
            error: error.message,
            data: null,
        });
    }

    res.json({
        success: successRes,
        message: messageRes,
        error: errorRes,
        data: dataRes,
        totalCount: totalCount,
    });
};
