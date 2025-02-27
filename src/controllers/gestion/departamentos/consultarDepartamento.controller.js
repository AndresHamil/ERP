import { pool } from "../../../db.js";
import * as methods from "../../../utils/methods.js";

export const consultarDepartamento = async (req, res) => {
    const { id } = req.body;
    const tableDb = "departamentos";

    let successRes = true,
        messageRes = "Consulta exitosa",
        errorRes = null,
        dataRes = null;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Se requiere un ID.",
            error: "ID field is missing in the request.",
            data: null,
        });
    }

    try {
        const queryConsulta = `
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
        const queryParamsConsulta = [id];

        const [result] = await pool.query(queryConsulta, queryParamsConsulta);

        if (result.length === 0) {
            messageRes = "No se encontraron registros";
        } else {
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
        }
    } catch (error) {
        successRes = false;
        errorRes = error.message;
        messageRes = "Ocurrió un error en el servidor";
        console.error("Error al consultar perfil:", error);
    }

    res.json({
        success: successRes,
        message: messageRes,
        error: errorRes,
        data: dataRes,
    });
};
