import { pool } from "../../../db.js";

export const eliminarUsuario = async (req, res) => {
    const { id } = req.body;
    const tableDb = "usuarios";

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "El ID es obligatorio.",
            error: null,
            data: null,
        });
    }

    let successRes = true,
        messageRes = "El usuario se eliminó correctamente.",
        errorRes = null,
        dataRes = null;

    try {
        const [result] = await pool.query(
            `DELETE FROM ${tableDb} WHERE id = ?`,
            [id]
        );

        if (!result.affectedRows) {
            successRes = false;
            messageRes = `No se encontró el usuario con ID '${id}'.`;
            errorRes = `No record found for ID '${id}' in table '${tableDb}'.`;
        }
    } catch (error) {
        successRes = false;
        errorRes = error.message;

        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            messageRes ="No se puede eliminar este usuario porque tiene registros dependientes.";
        } else {
            messageRes = "Error interno en el servidor.";
        }
    }

    res.json({
        success: successRes,
        message: messageRes,
        error: errorRes,
        data: dataRes,
    });
};
