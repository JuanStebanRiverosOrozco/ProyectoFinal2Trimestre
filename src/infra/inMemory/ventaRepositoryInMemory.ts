// src/infra/inMemory/VentaRepositoryInMemory.ts
import { Venta } from "../../domain/enditades/Venta";
import { IVentaRepository } from "../../domain/interFaces/IVentaRepository";

export class VentaRepositoryInMemory implements IVentaRepository {
  private ventas: Venta[] = [];

  guardar(venta: Venta): void {
    this.ventas.push(venta);
  }

  obtenerPorId(id: string): Venta | undefined {
    return this.ventas.find(v => v.getId() === id);
  }

  obtenerTodas(): Venta[] {
    return [...this.ventas];
  }

  obtenerPorFuncionId(funcionId: string): Venta[] {
    return this.ventas.filter(v => v.getFuncion().getId() === funcionId);
  }

  eliminarPorId(id: string): boolean {
    const index = this.ventas.findIndex(v => v.getId() === id);
    if (index !== -1) {
      this.ventas.splice(index, 1);
      return true;
    }
    return false;
  }
}
