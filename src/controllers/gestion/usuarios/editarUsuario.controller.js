import { pool } from "../../../db.js";

export const editarUsuario = async (req, res) => {
    const { id, nombre, usuario, password, estado } = req.body;

    const tableDb = "usuarios"; // Nombre de la tabla

    // Verificar que se reciba un ID
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Se requiere un ID.",
            error: null,
            data: null,
        });
    }

    let successRes = true,
        messageRes = "Edición exitosa",
        errorRes = null,
        dataRes = null;

    try {
        // Actualizar registro
        const [result] = await pool.query(
            `
            UPDATE ?? 
            SET 
                nombre = IFNULL(?, nombre),
                usuario = IFNULL(?, usuario), 
                password = IFNULL(?, password), 
                estado = IFNULL(?, estado) 
            WHERE id = ?
            `,
            [tableDb, nombre, usuario, password, estado, id]
        );

        // Verificar si se actualizó algún registro
        if (result.affectedRows) {
            const [updatedRecord] = await pool.query(
                `SELECT * FROM ?? WHERE id = ?`,
                [tableDb, id]
            );
            dataRes = updatedRecord;
        } else {
            successRes = false;
            messageRes = `El registro con id '${id}' no existe en la tabla '${tableDb}'.`;
            errorRes = `No record found for id '${id}' in table '${tableDb}'.`;
        }
    } catch (error) {
        successRes = false;
        errorRes = error.message;
        messageRes =
            error.code === "ER_DUP_ENTRY"
                ? "Ya existe un registro con el mismo nombre."
                : "Ocurrió un error en el servidor.";
    }

    res.json({
        success: successRes,
        message: messageRes,
        error: errorRes,
        data: dataRes,
    });
};
