import { pool } from "../../../db.js";

export const consultarPerfiles = async (req, res) => {
    const tableDb = "perfiles";

    let successRes = true,
        messageRes = "Consulta exitosa",
        errorRes = null,
        dataRes = null,
        totalCount = 0;

    try {
        const [dataResult] = await pool.query(`
            SELECT 
                perfiles.id,
                perfiles.nombre,
                perfiles.descripcion,
                perfiles.estado
            FROM 
                ${tableDb}
            ORDER BY perfiles.id DESC
            LIMIT 20;
        `);

        dataRes = dataResult.length ? dataResult : null;

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
