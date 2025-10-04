"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const ValidationError_1 = require("../errors/ValidationError");
class Usuario {
    constructor(id, nombre, correo, password, rol) {
        if (!nombre || nombre.trim() === "") {
            throw new ValidationError_1.ValidationError("El nombre es obligatorio.");
        }
        if (!correo || !correo.includes("@")) {
            throw new ValidationError_1.ValidationError("El correo electrónico no es válido.");
        }
        if (!["cliente", "admin", "vendedor"].includes(rol)) {
            throw new ValidationError_1.ValidationError("El rol del usuario no es válido.");
        }
        if (password.length < 4)
            throw new ValidationError_1.ValidationError("La contraseña debe tener al menos 4 caracteres.");
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.password = password;
        this.rol = rol;
    }
    // Getters
    getId() {
        return this.id;
    }
    getNombre() {
        return this.nombre;
    }
    getCorreo() {
        return this.correo;
    }
    getRol() {
        return this.rol;
    }
    validarPassword(password) {
        return this.password === password;
    }
    toString() {
        return `${this.nombre} (${this.rol}) - ${this.correo}`;
    }
}
exports.Usuario = Usuario;
