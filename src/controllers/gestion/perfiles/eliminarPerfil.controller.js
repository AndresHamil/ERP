import { pool } from "../../../db.js";

export const eliminarPerfil = async (req, res) => {
    const { id } = req.body;
    const tableDb = "perfiles";

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "El ID es obligatorio.",
            error: null,
        });
    }

    let successRes = true,
        messageRes = "El perfil se eliminó correctamente.",
        errorRes = null;

    try {
        // Query para eliminar el perfil
        const queryEliminacion = `DELETE FROM ${tableDb} WHERE id = ?`;
        const queryParamsEliminacion = [id];

        const [result] = await pool.query(queryEliminacion, queryParamsEliminacion);

        if (!result.affectedRows) {
            successRes = false;
            messageRes = `No se encontró el perfil con ID '${id}'.`;
            errorRes = `No record found for ID '${id}' in table '${tableDb}'.`;
        }
    } catch (error) {
        successRes = false;
        errorRes = error.message;

        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            messageRes =
                "No se puede eliminar este perfil porque tiene registros dependientes.";
        } else {
            messageRes = "Error interno en el servidor.";
        }
    }

    res.json({
        success: successRes,
        message: messageRes,
        error: errorRes,
    });
};
