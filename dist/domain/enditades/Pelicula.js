"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pelicula = void 0;
const ValidationError_1 = require("../errors/ValidationError");
class Pelicula {
    constructor(id, titulo, duracion, clasificacion, idioma, genero, disponible = true) {
        if (!titulo || titulo.trim() === "") {
            throw new ValidationError_1.ValidationError("El título es obligatorio.");
        }
        if (duracion <= 0) {
            throw new ValidationError_1.ValidationError("La duración debe ser mayor a 0.");
        }
        this.id = id;
        this.titulo = titulo;
        this.duracion = duracion;
        this.clasificacion = clasificacion;
        this.idioma = idioma;
        this.genero = genero;
        this.disponible = disponible;
    }
    // Getters
    getId() {
        return this.id;
    }
    getTitulo() {
        return this.titulo;
    }
    getDuracion() {
        return this.duracion;
    }
    getClasificacion() {
        return this.clasificacion;
    }
    getIdioma() {
        return this.idioma;
    }
    getGenero() {
        return this.genero;
    }
    isDisponible() {
        return this.disponible;
    }
    // Setter controlado
    setDisponible(disponible) {
        this.disponible = disponible;
    }
    toString() {
        return `${this.titulo} (${this.genero}, ${this.duracion} min, ${this.clasificacion})`;
    }
}
exports.Pelicula = Pelicula;
