"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuncionService = void 0;
// src/domain/services/FuncionService.ts
const Funcion_1 = require("../enditades/Funcion");
const ValidationError_1 = require("../errors/ValidationError");
const IdGenerator_1 = require("./IdGenerator");
class FuncionService {
    constructor(repo) {
        this.repo = repo;
    }
    crearFuncion(pelicula, sala, fecha, precio) {
        if (fecha.getTime() < Date.now()) {
            throw new ValidationError_1.ValidationError("La función no puede estar en el pasado.");
        }
        if (precio <= 0) {
            throw new ValidationError_1.ValidationError("El precio debe ser mayor a 0.");
        }
        // ✅ Validar si ya existe una función misma película + sala + fecha/hora
        const funcionesExistentes = this.repo.obtenerTodas();
        const duplicada = funcionesExistentes.some(f => f.getPelicula().getId() === pelicula.getId() &&
            f.getSala().getId() === sala.getId() &&
            f.getFecha().getTime() === fecha.getTime());
        if (duplicada) {
            throw new ValidationError_1.ValidationError("Ya existe una función para esta película en la misma sala, fecha y hora.");
        }
        const id = IdGenerator_1.IdGenerator.next("Funcion");
        const nueva = new Funcion_1.Funcion(id, pelicula, sala, fecha, precio);
        // Funcion constructor ya inicializa asientos desde la sala
        this.repo.guardar(nueva);
        return nueva;
    }
    listarFunciones() {
        return this.repo.obtenerTodas();
    }
    buscarFuncionPorId(id) {
        const funcion = this.repo.obtenerPorId(id);
        if (!funcion) {
            throw new ValidationError_1.ValidationError(`No existe una función con ID ${id}`);
        }
        return funcion;
    }
    eliminarFuncion(id) {
        const eliminado = this.repo.eliminarPorId(id);
        if (!eliminado) {
            throw new ValidationError_1.ValidationError(`No se encontró la función con ID ${id}`);
        }
    }
}
exports.FuncionService = FuncionService;
