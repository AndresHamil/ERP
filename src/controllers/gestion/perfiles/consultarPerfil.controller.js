import { pool } from "../../../db.js";

export const consultarPerfil = async (req, res) => {
    const { id } = req.body;
    const tableDb = "perfiles";

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
        // Query para consultar el perfil
        const queryConsulta = `
            SELECT 
                id,
                nombre,
                descripcion,
                estado
            FROM ${tableDb}
            WHERE id = ?
        `;
        const queryParamsConsulta = [id];

        const [result] = await pool.query(queryConsulta, queryParamsConsulta);

        if (result.length === 0) {
            messageRes = "No se encontraron registros";
        } else {
            dataRes = result;
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
