import { Pelicula } from "../enditades/Pelicula";

export interface IPeliculaRepository {
  guardar(pelicula: Pelicula): void;
  obtenerPorId(id: string): Pelicula | undefined;
  obtenerTodas(): Pelicula[];
  eliminarPorId(id: string): boolean;
  actualizar(id: string, data: Partial<Pelicula>): boolean;
}
