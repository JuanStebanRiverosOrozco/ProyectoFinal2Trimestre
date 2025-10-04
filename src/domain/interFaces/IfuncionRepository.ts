import { Funcion } from "../enditades/Funcion";

export interface IFuncionRepository {
  guardar(funcion: Funcion): void;
  obtenerPorId(id: string): Funcion | undefined;
  obtenerTodas(): Funcion[];
  eliminarPorId(id: string): boolean;
}
