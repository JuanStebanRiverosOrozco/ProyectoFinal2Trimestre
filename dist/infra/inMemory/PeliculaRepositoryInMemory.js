"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeliculaRepositoryInMemory = void 0;
class PeliculaRepositoryInMemory {
    constructor() {
        this.peliculas = [];
    }
    guardar(pelicula) {
        this.peliculas.push(pelicula);
    }
    obtenerPorId(id) {
        return this.peliculas.find(p => p.getId() === id);
    }
    obtenerTodas() {
        return [...this.peliculas]; // Devolver una copia
    }
    eliminarPorId(id) {
        const index = this.peliculas.findIndex(p => p.getId() === id);
        if (index !== -1) {
            this.peliculas.splice(index, 1);
            return true;
        }
        return false;
    }
    actualizar(id, data) {
        const pelicula = this.obtenerPorId(id);
        if (!pelicula)
            return false;
        // No hay setters públicos en la entidad, así que no se puede actualizar directamente.
        // En una implementación real, esto debería hacerse con setters controlados.
        return false;
    }
}
exports.PeliculaRepositoryInMemory = PeliculaRepositoryInMemory;
