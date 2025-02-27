import { pool } from "../../../db.js";

export const registrarPerfil = async (req, res) => {
    const { nombre, descripcion } = req.body;

    const tableDb = "perfiles";

    let successRes = true,
        messageRes = "Registro exitoso",
        errorRes = null,
        dataRes = null;

    try {
        const queryInsercion = `
            INSERT INTO ${tableDb}(nombre, descripcion) 
            VALUES (?, ?)
        `;
        const queryParamsInsercion = [nombre,descripcion];

        let [result] = await pool.query(queryInsercion, queryParamsInsercion);

        const id = result.insertId;


        const querySeleccion = `
            SELECT id, nombre, descripcion, estado 
            FROM ${tableDb} 
            WHERE id = ?
        `;
        const queryParamsSeleccion = [id];

        [result] = await pool.query(querySeleccion, queryParamsSeleccion);

        dataRes = result;

    } catch (error) {
        successRes = false;
        errorRes = error.message;
        dataRes = null;
        if (error.code === 'ER_DUP_ENTRY') {
            messageRes = "El perfil ya existe";
        } else {
            messageRes = "Error en el servidor";
        }
    }

    const response = {
        success: successRes,
        message: messageRes,
        error: errorRes,
        data: dataRes,
    };

    res.json(response);
};