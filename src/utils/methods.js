import { pool } from "../db.js";
import bcrypt from "bcrypt";

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
export const generarUsuario = (nombre, apellido) => {
    const nombreLimpio = nombre.replace(/\s+/g, "").toLowerCase();
    const apellidoLimpio = apellido.replace(/\s+/g, "").toLowerCase();

    const fecha = new Date();
    const fechaFormato = `${fecha.getMonth() + 1}${fecha.getDate()}${fecha.getFullYear() % 100}${fecha.getHours()}${fecha.getMinutes()}${fecha.getSeconds()}`;

    return `${nombreLimpio}${apellidoLimpio}${fechaFormato}`;
};
export const limpiarEspacios = (string) => {
    return string ? string.trim() : null;
};
export const validarRequerido = (campo, mensaje, valor) => {
    if (!campo) {
        const error = new Error((`${valor} is required.`));
        error.customMessage = mensaje;
        throw error;
    }
};
export const validarTipoDato = (campo, mensaje, valor, tipo) => {
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
        error.customMessage = mensaje;
        throw error;
    }
};
export const validarRequeridoEdicion = (campo, mensaje, errorMsg) => {
    if (campo === "") {
        const error = new Error(errorMsg);
        error.customMessage = mensaje;
        throw error;
    }
};
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
export const capitalizarString = (string) => {
    if (!string) {
        return; 
    }

    return string.split(" ") .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()).join(" ");
};
export const formatearFecha = (fecha) => {
    // Verificamos si la fecha es válida
    if (!fecha) {
        return null; // o un valor predeterminado si la fecha no está definida
    }

    const date = new Date(fecha);

    // Obtenemos el día, mes y año
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const año = String(date.getFullYear()).slice(-4); // Tomamos solo los últimos dos dígitos del año

    // Obtenemos la hora y los minutos
    let horas = date.getHours();
    const minutos = String(date.getMinutes()).padStart(2, "0");

    // Definimos si es AM o PM
    const ampm = horas >= 12 ? "pm" : "am";

    // Convertimos el formato de 24 horas a 12 horas
    horas = horas % 12;
    horas = horas ? String(horas).padStart(2, "0") : "12"; // El 0 se convierte en 12

    // Formateamos la fecha
    return `${año}/${mes}/${dia} ${horas}:${minutos} ${ampm}`;
};




