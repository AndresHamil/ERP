import { pool } from "../../../db.js";

export const eliminarSucursal = async (req, res) => {
    const { id } = req.body;
    const tableDb = "sucursales";

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "El ID es obligatorio.",
            error: null,
            data: null,
        });
    }

    let successRes = true,
        messageRes = "Sucursal eliminada.",
        errorRes = null,
        dataRes = null;

    try {
        const [result] = await pool.query(
            `DELETE FROM ${tableDb} WHERE id = ?`,
            [id]
        );

        if (!result.affectedRows) {
            successRes = false;
            messageRes = `No se encontró la sucursal con ID '${id}'.`;
            errorRes = `No record found for ID '${id}' in table '${tableDb}'.`;
        }
    } catch (error) {
        successRes = false;
        errorRes = error.message;

        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            messageRes =
                "No se puede eliminar esta sucursal porque tiene registros dependientes.";
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
