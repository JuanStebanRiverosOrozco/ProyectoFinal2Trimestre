"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaService = void 0;
// src/domain/services/SalaService.ts
const Sala_1 = require("../enditades/Sala");
const ValidationError_1 = require("../errors/ValidationError");
const IdGenerator_1 = require("./IdGenerator");
class SalaService {
    constructor(repo) {
        this.repo = repo;
    }
    crearSala(nombre, tipo, capacidad, filas, columnas) {
        if (!nombre || nombre.trim() === "") {
            throw new ValidationError_1.ValidationError("El nombre de la sala es obligatorio.");
        }
        if (capacidad <= 0) {
            throw new ValidationError_1.ValidationError("La capacidad debe ser mayor a 0.");
        }
        if (filas <= 0 || columnas <= 0) {
            throw new ValidationError_1.ValidationError("La sala debe tener al menos 1 fila y 1 columna.");
        }
        if (filas * columnas !== capacidad) {
            throw new ValidationError_1.ValidationError("La capacidad debe coincidir con filas x columnas.");
        }
        // 🔹 Validación: evitar nombres duplicados
        const normalizar = (s) => s.trim().toLowerCase();
        const existe = this.repo
            .obtenerTodas()
            .some((sala) => normalizar(sala.getNombre()) === normalizar(nombre));
        if (existe) {
            throw new ValidationError_1.ValidationError(`Ya existe una sala con el nombre "${nombre}".`);
        }
        const id = IdGenerator_1.IdGenerator.next("Sala");
        const nueva = new Sala_1.Sala(id, nombre, tipo, capacidad, filas, columnas);
        this.repo.guardar(nueva);
        return nueva;
    }
    listarSalas() {
        return this.repo.obtenerTodas();
    }
    buscarSalaPorId(id) {
        const sala = this.repo.obtenerPorId(id);
        if (!sala)
            throw new ValidationError_1.ValidationError("Sala no encontrada");
        return sala;
    }
    eliminarSala(id) {
        const ok = this.repo.eliminarPorId(id);
        if (!ok) {
            throw new ValidationError_1.ValidationError(`No se pudo eliminar: sala con ID ${id} no encontrada`);
        }
    }
}
exports.SalaService = SalaService;
