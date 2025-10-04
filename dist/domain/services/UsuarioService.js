"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
const Usuario_1 = require("../enditades/Usuario");
const ValidationError_1 = require("../errors/ValidationError");
const IdGenerator_1 = require("./IdGenerator");
class UsuarioService {
    constructor(repo) {
        this.repo = repo;
    }
    registrar(nombre, correo, password, rol) {
        if (this.repo.obtenerPorCorreo(nombre, correo)) {
            throw new ValidationError_1.ValidationError("Ya existe un usuario con este correo.");
        }
        const id = IdGenerator_1.IdGenerator.next("Usuario");
        const nuevo = new Usuario_1.Usuario(id, nombre, correo, password, rol);
        this.repo.guardar(nuevo);
        return nuevo;
    }
    login(nombre, correo, password) {
        const usuario = this.repo.obtenerPorCorreo(nombre, correo);
        if (!usuario || !usuario.validarPassword(password)) {
            throw new ValidationError_1.ValidationError("Nombre,correo o contraseña incorrectos.");
        }
        return usuario;
    }
    /**
     * Busca un cliente por correo y nombre.
     * Si no existe, lo crea automáticamente como cliente.
     */
    buscarPorCorreo(nombre, correo) {
        const usuario = this.repo.obtenerPorCorreo(nombre, correo);
        return usuario ?? null;
    }
}
exports.UsuarioService = UsuarioService;
