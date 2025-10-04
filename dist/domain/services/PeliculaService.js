"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeliculaService = void 0;
// src/domain/services/PeliculaService.ts
const Pelicula_1 = require("../enditades/Pelicula");
const ValidationError_1 = require("../errors/ValidationError");
const IdGenerator_1 = require("./IdGenerator");
class PeliculaService {
    constructor(repo) {
        this.repo = repo;
    }
    crearPelicula(titulo, duracion, clasificacion, idioma, genero) {
        if (!titulo || titulo.trim() === "") {
            throw new ValidationError_1.ValidationError("El título no puede estar vacío.");
        }
        if (duracion <= 0) {
            throw new ValidationError_1.ValidationError("La duración debe ser mayor a 0.");
        }
        // 🔹 Normalizamos título (para evitar duplicados por mayúsculas o espacios)
        const normalizar = (s) => s.trim().toLowerCase();
        const existe = this.repo
            .obtenerTodas()
            .some((p) => normalizar(p.getTitulo()) === normalizar(titulo));
        if (existe) {
            throw new ValidationError_1.ValidationError(`Ya existe una película con el título "${titulo}".`);
        }
        const id = IdGenerator_1.IdGenerator.next("Pelicula");
        const nuevaPelicula = new Pelicula_1.Pelicula(id, titulo, duracion, clasificacion, idioma, genero);
        this.repo.guardar(nuevaPelicula);
        return nuevaPelicula;
    }
    listarPeliculas() {
        return this.repo.obtenerTodas();
    }
    eliminarPelicula(id) {
        const eliminado = this.repo.eliminarPorId(id);
        if (!eliminado) {
            throw new ValidationError_1.ValidationError(`No se encontró una película con ID ${id}`);
        }
    }
    buscarPeliculaPorId(id) {
        const pelicula = this.repo.obtenerPorId(id);
        if (!pelicula)
            throw new ValidationError_1.ValidationError("Película no encontrada");
        return pelicula;
    }
}
exports.PeliculaService = PeliculaService;
