// src/infra/inMemory/SalaRepositoryInMemory.ts
import { Sala } from "../../domain/enditades/Sala";
import { ISalaRepository } from "../../domain/interFaces/ISalaRepository";

export class SalaRepositoryInMemory implements ISalaRepository {
  private salas: Sala[] = [];

  guardar(sala: Sala): void {
    this.salas.push(sala);
  }

  obtenerPorId(id: string): Sala | undefined {
    return this.salas.find(s => s.getId() === id);
  }

  obtenerTodas(): Sala[] {
    return [...this.salas];
  }

  eliminarPorId(id: string): boolean {
    const index = this.salas.findIndex(s => s.getId() === id);
    if (index !== -1) {
      this.salas.splice(index, 1);
      return true;
    }
    return false;
  }

  actualizar(id: string, data: Partial<Sala>): boolean {
    const sala = this.obtenerPorId(id);
    if (!sala) return false;

    // Esta clase no tiene setters, así que no se puede actualizar.
    // Se puede reemplazar por una nueva instancia si es necesario.
    return false;
  }
}
