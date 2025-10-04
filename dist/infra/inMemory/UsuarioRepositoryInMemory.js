"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRepositoryInMemory = void 0;
class UsuarioRepositoryInMemory {
    constructor() {
        this.usuarios = [];
    }
    guardar(usuario) {
        this.usuarios.push(usuario);
    }
    obtenerPorId(id) {
        return this.usuarios.find(u => u.getId() === id);
    }
    obtenerPorCorreo(nombre, correo) {
        return this.usuarios.find(u => u.getNombre() === nombre && u.getCorreo() === correo);
    }
    obtenerTodos() {
        return [...this.usuarios];
    }
    eliminarPorId(id) {
        const index = this.usuarios.findIndex(u => u.getId() === id);
        if (index !== -1) {
            this.usuarios.splice(index, 1);
            return true;
        }
        return false;
    }
}
exports.UsuarioRepositoryInMemory = UsuarioRepositoryInMemory;
