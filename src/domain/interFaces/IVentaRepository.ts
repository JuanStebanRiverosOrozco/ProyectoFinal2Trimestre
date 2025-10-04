import { Venta } from "../enditades/Venta";

export interface IVentaRepository {
  guardar(venta: Venta): void;
  obtenerPorId(id: string): Venta | undefined;
  obtenerTodas(): Venta[];
  obtenerPorFuncionId(funcionId: string): Venta[];
  eliminarPorId(id: string): boolean;
}
