"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
const ValidationError_1 = require("../errors/ValidationError");
class Funcion {
    constructor(id, pelicula, sala, fecha, precio) {
        // Nueva representación por función: ids de asientos (matriz) y set de ocupados
        this.seatIds = [];
        this.ocupados = new Set();
        if (!pelicula)
            throw new ValidationError_1.ValidationError("La película es obligatoria.");
        if (!sala)
            throw new ValidationError_1.ValidationError("La sala es obligatoria.");
        if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
            throw new ValidationError_1.ValidationError("La fecha debe ser válida.");
        }
        if (precio <= 0)
            throw new ValidationError_1.ValidationError("El precio debe ser mayor que 0.");
        this.id = id;
        this.pelicula = pelicula;
        this.sala = sala;
        this.fecha = fecha;
        this.precio = precio;
        // Inicializa el mapa de asientos a partir de la sala (cada función tiene su propio estado)
        this.inicializarAsientosDesdeSala();
    }
    // ======================
    // Métodos nuevos (asientos por función)
    // ======================
    inicializarAsientosDesdeSala() {
        this.seatIds = this.sala.generarMapaIds();
        this.ocupados = new Set();
    }
    /**
     * Devuelve un número de asientos disponibles (cuenta de los no ocupados)
     */
    getAsientosDisponibles() {
        let total = 0;
        for (const fila of this.seatIds) {
            total += fila.length;
        }
        return total - this.ocupados.size;
    }
    /**
     * Devuelve una matriz visual usando iconos (💺 disponible, ❌ ocupado).
     * Útil para mostrar el plano en consola.
     */
    getMapaVisual() {
        return this.seatIds
            .map(fila => fila
            .map(id => (this.ocupados.has(id) ? "❌" : "💺"))
            .join(" "))
            .join("\n");
    }
    /**
     * Devuelve una matriz con "ID(icono)" para mostrar filas con detalle
     * Ej: A1(💺) A2(❌) ...
     */
    getMapaConIds() {
        return this.seatIds
            .map(fila => fila
            .map(id => `${id}(${this.ocupados.has(id) ? "❌" : "💺"})`)
            .join(" "))
            .join("\n");
    }
    /**
     * Lista los IDs de asientos disponibles (flat)
     */
    listarAsientosDisponibles() {
        const disponibles = [];
        for (const fila of this.seatIds) {
            for (const id of fila) {
                if (!this.ocupados.has(id))
                    disponibles.push(id);
            }
        }
        return disponibles;
    }
    /**
     * Retorna info simple sobre un asiento por su ID
     */
    getAsientoPorId(id) {
        for (const fila of this.seatIds) {
            for (const seatId of fila) {
                if (seatId === id) {
                    return { id: seatId, disponible: !this.ocupados.has(seatId) };
                }
            }
        }
        return undefined;
    }
    /**
     * Ocupa un asiento por su ID. Retorna true si lo ocupó, false si ya estaba ocupado o no existe.
     */
    ocuparAsiento(id) {
        const asiento = this.getAsientoPorId(id);
        if (!asiento)
            return false;
        if (!asiento.disponible)
            return false;
        this.ocupados.add(id);
        return true;
    }
    /**
     * Método de compatibilidad: resta 'cantidad' ocupando los primeros asientos libres.
     */
    restarAsientos(cantidad) {
        if (cantidad <= 0) {
            throw new ValidationError_1.ValidationError("La cantidad debe ser mayor a 0.");
        }
        const disponibles = this.listarAsientosDisponibles();
        if (cantidad > disponibles.length) {
            throw new ValidationError_1.ValidationError("No hay suficientes asientos.");
        }
        for (let i = 0; i < cantidad; i++) {
            this.ocupados.add(disponibles[i]);
        }
    }
    // ======================
    // Getters originales (no eliminados)
    // ======================
    getId() {
        return this.id;
    }
    getPelicula() {
        return this.pelicula;
    }
    getSala() {
        return this.sala;
    }
    getFecha() {
        return this.fecha;
    }
    getPrecio() {
        return this.precio;
    }
    getAsientosVendidos() {
        return this.ocupados.size;
    }
    toString() {
        const fechaStr = this.fecha.toLocaleString("es-PE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
        return `${this.pelicula.getTitulo()} | Sala: ${this.sala.getNombre()} | ${fechaStr} | Precio_Unitario: $${(this.precio).toLocaleString()} | Disp: ${this.getAsientosDisponibles()}`;
    }
}
exports.Funcion = Funcion;
