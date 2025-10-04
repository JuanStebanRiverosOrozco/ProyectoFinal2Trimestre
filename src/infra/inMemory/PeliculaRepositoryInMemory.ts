// src/infra/inMemory/PeliculaRepositoryInMemory.ts
import { Pelicula } from "../../domain/enditades/Pelicula";
import { IPeliculaRepository } from "../../domain/interFaces/IPeliculaRepository";

export class PeliculaRepositoryInMemory implements IPeliculaRepository {
  private peliculas: Pelicula[] = [];

  guardar(pelicula: Pelicula): void {
    this.peliculas.push(pelicula);
  }

  obtenerPorId(id: string): Pelicula | undefined {
    return this.peliculas.find(p => p.getId() === id);
  }

  obtenerTodas(): Pelicula[] {
    return [...this.peliculas]; // Devolver una copia
  }

  eliminarPorId(id: string): boolean {
    const index = this.peliculas.findIndex(p => p.getId() === id);
    if (index !== -1) {
      this.peliculas.splice(index, 1);
      return true;
    }
    return false;
  }

  actualizar(id: string, data: Partial<Pelicula>): boolean {
    const pelicula = this.obtenerPorId(id);
    if (!pelicula) return false;

    // No hay setters públicos en la entidad, así que no se puede actualizar directamente.
    // En una implementación real, esto debería hacerse con setters controlados.
    return false;
  }
}
