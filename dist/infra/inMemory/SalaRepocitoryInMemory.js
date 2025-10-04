"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaRepositoryInMemory = void 0;
class SalaRepositoryInMemory {
    constructor() {
        this.salas = [];
    }
    guardar(sala) {
        this.salas.push(sala);
    }
    obtenerPorId(id) {
        return this.salas.find(s => s.getId() === id);
    }
    obtenerTodas() {
        return [...this.salas];
    }
    eliminarPorId(id) {
        const index = this.salas.findIndex(s => s.getId() === id);
        if (index !== -1) {
            this.salas.splice(index, 1);
            return true;
        }
        return false;
    }
    actualizar(id, data) {
        const sala = this.obtenerPorId(id);
        if (!sala)
            return false;
        // Esta clase no tiene setters, así que no se puede actualizar.
        // Se puede reemplazar por una nueva instancia si es necesario.
        return false;
    }
}
exports.SalaRepositoryInMemory = SalaRepositoryInMemory;
