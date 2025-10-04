"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sala = void 0;
// src/domain/enditades/Sala.ts
const ValidationError_1 = require("../errors/ValidationError");
class Sala {
    constructor(id, nombre, tipo, capacidad, filas, columnas) {
        if (!nombre || nombre.trim() === "") {
            throw new ValidationError_1.ValidationError("El nombre de la sala es obligatorio.");
        }
        if (!["2D", "3D", "VIP"].includes(tipo)) {
            throw new ValidationError_1.ValidationError("El tipo de sala no es válido.");
        }
        if (capacidad <= 0) {
            throw new ValidationError_1.ValidationError("La capacidad debe ser mayor a 0.");
        }
        // Si no se pasan filas/columnas, se asume 1 fila x capacidad (retrocompatibilidad)
        if (!filas || !columnas) {
            filas = 1;
            columnas = capacidad;
        }
        if (filas <= 0 || columnas <= 0) {
            throw new ValidationError_1.ValidationError("La sala debe tener al menos 1 fila y 1 columna.");
        }
        if (filas * columnas !== capacidad) {
            throw new ValidationError_1.ValidationError("La capacidad debe coincidir con filas x columnas.");
        }
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.capacidad = capacidad;
        this.filas = filas;
        this.columnas = columnas;
    }
    // Getters originales
    getId() {
        return this.id;
    }
    getNombre() {
        return this.nombre;
    }
    getTipo() {
        return this.tipo;
    }
    getCapacidad() {
        return this.capacidad;
    }
    // Nuevos getters para filas/columnas
    getFilas() {
        return this.filas;
    }
    getColumnas() {
        return this.columnas;
    }
    toString() {
        return `${this.nombre} (${this.tipo}) - Capacidad: ${this.capacidad}`;
    }
    /**
     * Genera la matriz de IDs de asientos (etiquetas): A1, A2, ..., B1, ...
     * Devuelve una matriz [fila][columna] de strings (IDs).
     */
    generarMapaIds() {
        const map = [];
        const startCharCode = "A".charCodeAt(0);
        for (let r = 0; r < this.filas; r++) {
            const fila = [];
            const rowLetter = String.fromCharCode(startCharCode + r);
            for (let c = 1; c <= this.columnas; c++) {
                fila.push(`${rowLetter}${c}`);
            }
            map.push(fila);
        }
        return map;
    }
}
exports.Sala = Sala;
