"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentaRepositoryInMemory = void 0;
class VentaRepositoryInMemory {
    constructor() {
        this.ventas = [];
    }
    guardar(venta) {
        this.ventas.push(venta);
    }
    obtenerPorId(id) {
        return this.ventas.find(v => v.getId() === id);
    }
    obtenerTodas() {
        return [...this.ventas];
    }
    obtenerPorFuncionId(funcionId) {
        return this.ventas.filter(v => v.getFuncion().getId() === funcionId);
    }
    eliminarPorId(id) {
        const index = this.ventas.findIndex(v => v.getId() === id);
        if (index !== -1) {
            this.ventas.splice(index, 1);
            return true;
        }
        return false;
    }
}
exports.VentaRepositoryInMemory = VentaRepositoryInMemory;
