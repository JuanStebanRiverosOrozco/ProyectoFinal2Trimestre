"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentaService = void 0;
// src/domain/services/VentaService.ts
const Venta_1 = require("../enditades/Venta");
const ValidationError_1 = require("../errors/ValidationError");
const IdGenerator_1 = require("./IdGenerator");
class VentaService {
    constructor(repo) {
        this.repo = repo;
    }
    realizarVenta(usuario, funcionId, asientosIds, funcionService, nombre, // 👈 opcional, para cuando un vendedor vende a un cliente externo
    correo) {
        const funcion = funcionService.buscarFuncionPorId(funcionId);
        if (!funcion) {
            throw new ValidationError_1.ValidationError("Función no encontrada.");
        }
        if (!asientosIds || asientosIds.length === 0) {
            throw new ValidationError_1.ValidationError("Debes seleccionar al menos un asiento.");
        }
        // Verificar existencia y disponibilidad
        for (const id of asientosIds) {
            const asientoInfo = funcion.getAsientoPorId(id);
            if (!asientoInfo) {
                throw new ValidationError_1.ValidationError(`El asiento con ID ${id} no existe.`);
            }
            if (!asientoInfo.disponible) {
                throw new ValidationError_1.ValidationError(`El asiento ${id} ya está ocupado.`);
            }
        }
        // Ocupar asientos (se marca en la función)
        for (const id of asientosIds) {
            const ok = funcion.ocuparAsiento(id);
            if (!ok) {
                // Esto no debería ocurrir por la verificación previa, pero lo manejamos
                throw new ValidationError_1.ValidationError(`No se pudo ocupar el asiento ${id}.`);
            }
        }
        // Crear la venta
        const id = IdGenerator_1.IdGenerator.next("Venta");
        const venta = new Venta_1.Venta(id, funcion, asientosIds.length, asientosIds, usuario.getId(), nombre || usuario.getNombre(), correo || usuario.getCorreo());
        this.repo.guardar(venta);
        return venta;
    }
    listarVentas() {
        return this.repo.obtenerTodas();
    }
    // 🔹 Nuevo método: listar ventas de un usuario
    listarVentasPorUsuario(usuarioId) {
        return this.repo.obtenerTodas().filter(v => v.getUsuarioId() === usuarioId);
    }
}
exports.VentaService = VentaService;
