"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComidaVenta = void 0;
const ValidationError_1 = require("../errors/ValidationError");
class ComidaVenta {
    constructor(id, comprador, items) {
        if (!items || items.length === 0)
            throw new ValidationError_1.ValidationError("La venta debe incluir al menos un producto o combo.");
        this.id = id;
        this.compradorId = comprador.getId ? comprador.getId() : undefined;
        this.compradorNombre = comprador.getNombre();
        this.compradorCorreo = comprador.getCorreo();
        this.items = items;
        this.total = items.reduce((sum, c) => sum + c.getPrecio(), 0);
    }
    getId() {
        return this.id;
    }
    getCompradorId() {
        return this.compradorId;
    }
    getCompradorNombre() {
        return this.compradorNombre;
    }
    getCompradorCorreo() {
        return this.compradorCorreo;
    }
    getItems() {
        return this.items;
    }
    getTotal() {
        return this.total;
    }
}
exports.ComidaVenta = ComidaVenta;
