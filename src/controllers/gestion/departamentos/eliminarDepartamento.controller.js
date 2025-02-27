import { pool } from "../../../db.js";

export const eliminarDepartamento = async (req, res) => {
    const { id } = req.body;
    const tableDb = "departamentos";

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "El ID es obligatorio.",
            error: null,
            data: null,
        });
    }

    let successRes = true,
        messageRes = "El departamento se eliminó correctamente.",
        errorRes = null,
        dataRes = null;

    try {
        const [result] = await pool.query(
            `DELETE FROM ${tableDb} WHERE id = ?`,
            [id]
        );

        if (!result.affectedRows) {
            successRes = false;
            messageRes = `No se encontró el departamento con ID '${id}'.`;
            errorRes = `No record found for ID '${id}' in table '${tableDb}'.`;
        }
    } catch (error) {
        successRes = false;
        errorRes = error.message;

        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            messageRes =
                "No se puede eliminar este departamento porque tiene registros dependientes.";
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
