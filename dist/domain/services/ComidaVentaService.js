"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComidaVentaService = void 0;
const ComidaVenta_1 = require("../enditades/ComidaVenta");
const ValidationError_1 = require("../errors/ValidationError");
const IdGenerator_1 = require("./IdGenerator");
class ComidaVentaService {
    constructor() {
        this.ventas = [];
    }
    realizarVenta(comprador, seleccionados, comidaService) {
        if (!seleccionados || seleccionados.length === 0)
            throw new ValidationError_1.ValidationError("Debe seleccionar al menos un producto.");
        const items = [];
        for (const id of seleccionados) {
            const item = comidaService.buscarPorId(id);
            if (!item)
                throw new ValidationError_1.ValidationError(`El producto/combo con ID ${id} no existe.`);
            items.push(item);
        }
        const id = IdGenerator_1.IdGenerator.next("ComidaVenta");
        const venta = new ComidaVenta_1.ComidaVenta(id, comprador, items);
        this.ventas.push(venta);
        return venta;
    }
    listarVentas() {
        return this.ventas;
    }
    listarVentasPorUsuario(usuarioId) {
        return this.ventas.filter((v) => v.getCompradorId() === usuarioId);
    }
}
exports.ComidaVentaService = ComidaVentaService;
