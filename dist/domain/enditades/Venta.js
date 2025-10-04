"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venta = void 0;
const ValidationError_1 = require("../errors/ValidationError");
class Venta {
    constructor(id, funcion, cantidad, asientosIds = [], usuarioId, usuarioNombre, usuarioCorreo) {
        if (!funcion) {
            throw new ValidationError_1.ValidationError("La función no puede estar vacía.");
        }
        if (cantidad <= 0) {
            throw new ValidationError_1.ValidationError("La cantidad de entradas debe ser mayor a 0.");
        }
        // si asientosIds se pasó, ajustar cantidad para consistencia
        if (asientosIds.length > 0 && asientosIds.length !== cantidad) {
            // preferimos confiar en los asientos provistos: ajustar cantidad al length
            cantidad = asientosIds.length;
        }
        this.id = id;
        this.funcion = funcion;
        this.cantidad = cantidad;
        this.asientosIds = asientosIds;
        this.usuarioId = usuarioId;
        this.precio = funcion.getPrecio();
        this.total = funcion.getPrecio() * this.cantidad;
        this.fecha = new Date();
        this.usuarioNombre = usuarioNombre;
        this.usuarioCorreo = usuarioCorreo;
    }
    // Getters
    getId() {
        return this.id;
    }
    getFuncion() {
        return this.funcion;
    }
    getCantidad() {
        return this.cantidad;
    }
    getPrecio() {
        return this.precio;
    }
    getTotal() {
        return this.total;
    }
    getFecha() {
        return this.fecha;
    }
    getAsientosIds() {
        return this.asientosIds;
    }
    getUsuarioId() {
        return this.usuarioId;
    }
    getNombre() {
        return this.usuarioNombre;
    }
    getCorreo() {
        return this.usuarioCorreo;
    }
    toString() {
        const asientosStr = this.asientosIds && this.asientosIds.length > 0 ? ` Asientos: [${this.asientosIds.join(", ")}]` : "";
        return `Venta #${this.id} - ${this.cantidad} entradas para ${this.funcion.getPelicula().getTitulo()} - Total: $${(this.total).toLocaleString()}${asientosStr}`;
    }
}
exports.Venta = Venta;
