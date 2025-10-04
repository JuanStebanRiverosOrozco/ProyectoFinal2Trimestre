"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuncionRepositoryInMemory = void 0;
class FuncionRepositoryInMemory {
    constructor() {
        this.funciones = [];
    }
    guardar(funcion) {
        this.funciones.push(funcion);
    }
    obtenerPorId(id) {
        return this.funciones.find(f => f.getId() === id);
    }
    obtenerTodas() {
        return [...this.funciones];
    }
    eliminarPorId(id) {
        const index = this.funciones.findIndex(f => f.getId() === id);
        if (index !== -1) {
            this.funciones.splice(index, 1);
            return true;
        }
        return false;
    }
}
exports.FuncionRepositoryInMemory = FuncionRepositoryInMemory;
