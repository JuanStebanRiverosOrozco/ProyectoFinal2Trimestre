// src/infra/inMemory/FuncionRepositoryInMemory.ts
import { Funcion } from "../../domain/enditades/Funcion";
import { IFuncionRepository } from "../../domain/interFaces/IfuncionRepository";

export class FuncionRepositoryInMemory implements IFuncionRepository {
  private funciones: Funcion[] = [];

  guardar(funcion: Funcion): void {
    this.funciones.push(funcion);
  }

  obtenerPorId(id: string): Funcion | undefined {
    return this.funciones.find(f => f.getId() === id);
  }

  obtenerTodas(): Funcion[] {
    return [...this.funciones];
  }

  eliminarPorId(id: string): boolean {
    const index = this.funciones.findIndex(f => f.getId() === id);
    if (index !== -1) {
      this.funciones.splice(index, 1);
      return true;
    }
    return false;
  }
}
