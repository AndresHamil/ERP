import { pool } from "../db.js";
import bcrypt from "bcrypt";

// ------------------------------------------------------- [VALIDAR CONTENIDO]
export const validarRequerido = (campo, prefijo, valor) => {
    if (!campo) {
        const error = new Error(`The ${valor} is required.`);
        error.customMessage = `${prefijo} ${valor} es requerido.`;
        throw error;
    }
};
export const validarContenidoString = (campo, prefijo, valor) => {
    if (typeof campo === "string") {
        const contieneNumeros = /\d/.test(campo);

        if (contieneNumeros) {
            const error = new Error(`The ${valor} must not contain numeric characters.`);
            error.customMessage = `${prefijo} ${valor} no debe tener caracteres numéricos.`;
            throw error;
        }
    }
};
export const validarRequeridoEdicion = (campo, prefijo, valor) => {
    if (campo === "") {
        const error = new Error(`The ${valor} is required.`);
        error.customMessage = `${prefijo} ${valor} es requerido.`;
        throw error;
    }
};
export const validarLongitudString = (campo, tipo, valor, len) => {
    if (campo && campo.length > len) {
        const error = new Error(`The ${valor} must have a maximum of ${len} characters.`);
        error.customMessage = `${tipo} ${valor} solo puede tener un maximo de ${len} caracteres.`;
        throw error;
    }
};
// ------------------------------------------------------- [VALIDAR FORMATO CONTENIDO]
export const validarFormatoEmail = (email) => {
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || !regexEmail.test(email)) {
        const error = new Error(`Invalid email format.`);
        error.customMessage = `El correo electrónico proporcionado no es válido.`; 
        throw error;
    }
};
export const validarFormatoTelefono = (telefono) => {
    if (!telefono) {
        return; 
    }

    const regexTelefono = /^[0-9]{10}$/;

    if (!regexTelefono.test(telefono)) {
        const error = new Error(`Invalid phone format.`);
        error.customMessage = `El teléfono proporcionado no es válido. Debe tener 10 dígitos.`; 
        throw error;
    }
};
// ------------------------------------------------------- [VALIDAR TIPO DATO]
export const validarTipoDato = (campo, prefijo, valor, tipo) => {
    const tiposValidos = {
        string: (valor) => valor === null || typeof valor === "string",
        int: (valor) => valor === null || Number.isInteger(valor),
        float: (valor) => valor === null || (typeof valor === "number" && !Number.isInteger(valor)),
        object: (valor) => valor === null || (typeof valor === "object" && !Array.isArray(valor)),
        array: (valor) => valor === null || Array.isArray(valor),
        bool: (valor) => valor === null || typeof valor === "boolean"
    };

    if (!tiposValidos[tipo]) {
        throw new Error(`Invalid type "${valor}". Allowed types: ${Object.keys(tiposValidos).join(", ")}`);
    }

    if (!tiposValidos[tipo](campo)) {
        
        const error = new Error((`The ${valor} does not have the correct format.`));
        error.customMessage = `${prefijo} ${valor} no tiene el formato adecuado.`;
        throw error;
    }
};
// ------------------------------------------------------- [LIMPIAR CONTENIDO]
export const limpiarEspacios = (string) => {
    return string != null ? string.trim() : null;
};
// ------------------------------------------------------- [CAPITALIZAR CONTENIDO]
export const capitalizarString = (string) => {
    if (string == null) {
        return; 
    }

    return string.split(" ") .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()).join(" ");
};
// ------------------------------------------------------- [FORMATEAR CONTENIDO]
export const formatearFecha = (fecha) => {
    if (!fecha) {
        return null;
    }

    const date = new Date(fecha);

    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const año = String(date.getFullYear()).slice(-4); // Tomamos solo los últimos dos dígitos del año

    let horas = date.getHours();
    const minutos = String(date.getMinutes()).padStart(2, "0");

    const ampm = horas >= 12 ? "pm" : "am";

    horas = horas % 12;
    horas = horas ? String(horas).padStart(2, "0") : "12"; // El 0 se convierte en 12

    return `${año}/${mes}/${dia} ${horas}:${minutos} ${ampm}`;
};
// ------------------------------------------------------- [HASH PASSWORD]
export const generarHash = (password) => {
    if (!password) {
        return; 
    }
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}
export const compararHash = (password, hash) => {
    return bcrypt.compare(password, hash);
}
// ------------------------------------------------------- [GENERAR USUARIO]
export const generarUsuario = (nombre, apellido) => {
    const primerNombre = nombre.split(" ")[0] ?? "";
    const primerApellido = apellido.split(" ")[0] ?? "";

    const nombreLimpio = primerNombre.replace(/\s+/g, "").toLowerCase();
    const apellidoLimpio = primerApellido.replace(/\s+/g, "").toLowerCase();

    const fecha = new Date();
    const fechaFormato = `${fecha.getMonth() + 1}${fecha.getDate()}${fecha.getFullYear() % 100}${fecha.getHours()}${fecha.getMinutes()}${fecha.getSeconds()}`;

    return `${nombreLimpio}.${apellidoLimpio}.${fechaFormato}`;
};
// ------------------------------------------------------- [GENERAR USUARIO EDICION]
export const generarUsuarioEdicion = async (id, nombre, apellido) => {
    if ((nombre !== null && nombre !== "") || (apellido !== null && apellido !== "")) {
        const queryConsulta = `
            SELECT 
                usuarios.id,
                usuarios.nombre,
                usuarios.apellido
            FROM 
                usuarios
            WHERE usuarios.id = ?
        `;
        const queryParamsConsulta = [id];

        const [resutl] = await pool.query(queryConsulta, queryParamsConsulta);
            
        if (resutl.length === 0) {
            const error = new Error(`No record found for id '${id}' in table 'usuarios'.`);
            error.customMessage = `El registro con id '${id}' no existe en la tabla 'usuarios'.`;
            throw error;
        }else{
            const usuario = resutl[0];
            const nombreUsuario = nombre ? nombre : usuario.nombre;
            const apellidoUsuario = apellido ? apellido : usuario.apellido;

            return generarUsuario(nombreUsuario, apellidoUsuario);
        }
    }
};