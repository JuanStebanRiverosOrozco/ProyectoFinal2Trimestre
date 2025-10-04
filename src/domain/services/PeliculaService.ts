// src/domain/services/PeliculaService.ts
import { Pelicula, Clasificacion, Genero, Idioma } from "../enditades/Pelicula";
import { IPeliculaRepository } from "../interFaces/IPeliculaRepository";
import { ValidationError } from "../errors/ValidationError";
import { IdGenerator } from "./IdGenerator";


export class PeliculaService {
  constructor(private readonly repo: IPeliculaRepository) { }

  crearPelicula(
    titulo: string,
    duracion: number,
    clasificacion: Clasificacion,
    idioma: Idioma,
    genero: Genero
  ): Pelicula {
    if (!titulo || titulo.trim() === "") {
      throw new ValidationError("El título no puede estar vacío.");
    }
    if (duracion <= 0) {
      throw new ValidationError("La duración debe ser mayor a 0.");
    }

    // 🔹 Normalizamos título (para evitar duplicados por mayúsculas o espacios)
    const normalizar = (s: string) => s.trim().toLowerCase();

    const existe = this.repo
      .obtenerTodas()
      .some((p) => normalizar(p.getTitulo()) === normalizar(titulo));

    if (existe) {
      throw new ValidationError(`Ya existe una película con el título "${titulo}".`);
    }

    const id = IdGenerator.next("Pelicula");
    const nuevaPelicula = new Pelicula(id, titulo, duracion, clasificacion, idioma, genero);
    this.repo.guardar(nuevaPelicula);
    return nuevaPelicula;
  }

  listarPeliculas(): Pelicula[] {
    return this.repo.obtenerTodas();
  }

  eliminarPelicula(id: string): void {
    const eliminado = this.repo.eliminarPorId(id);
    if (!eliminado) {
      throw new ValidationError(`No se encontró una película con ID ${id}`);
    }
  }

  buscarPeliculaPorId(id: string): Pelicula {
    const pelicula = this.repo.obtenerPorId(id);
    if (!pelicula) throw new ValidationError("Película no encontrada");
    return pelicula;
  }

}
