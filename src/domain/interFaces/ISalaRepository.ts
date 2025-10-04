import { Sala } from "../enditades/Sala";

export interface ISalaRepository {
  guardar(sala: Sala): void;
  obtenerPorId(id: string): Sala | undefined;
  obtenerTodas(): Sala[];
  eliminarPorId(id: string): boolean;
  actualizar(id: string, data: Partial<Sala>): boolean;
}
