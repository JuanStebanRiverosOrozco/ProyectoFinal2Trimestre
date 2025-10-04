// src/domain/services/SalaService.ts
import { Sala, TipoSala } from "../enditades/Sala";
import { ISalaRepository } from "../interFaces/ISalaRepository";
import { ValidationError } from "../errors/ValidationError";
import { IdGenerator } from "./IdGenerator";

export class SalaService {
  constructor(private readonly repo: ISalaRepository) { }

  crearSala(nombre: string, tipo: TipoSala, capacidad: number, filas: number, columnas: number): Sala {
    if (!nombre || nombre.trim() === "") {
      throw new ValidationError("El nombre de la sala es obligatorio.");
    }

    if (capacidad <= 0) {
      throw new ValidationError("La capacidad debe ser mayor a 0.");
    }

    if (filas <= 0 || columnas <= 0) {
      throw new ValidationError("La sala debe tener al menos 1 fila y 1 columna.");
    }

    if (filas * columnas !== capacidad) {
      throw new ValidationError("La capacidad debe coincidir con filas x columnas.");
    }

    // 🔹 Validación: evitar nombres duplicados
    const normalizar = (s: string) => s.trim().toLowerCase();
    const existe = this.repo
      .obtenerTodas()
      .some((sala) => normalizar(sala.getNombre()) === normalizar(nombre));

    if (existe) {
      throw new ValidationError(`Ya existe una sala con el nombre "${nombre}".`);
    }

    const id = IdGenerator.next("Sala");
    const nueva = new Sala(id, nombre, tipo, capacidad, filas, columnas);
    this.repo.guardar(nueva);
    return nueva;
  }

  listarSalas(): Sala[] {
    return this.repo.obtenerTodas();
  }

  buscarSalaPorId(id: string): Sala {
    const sala = this.repo.obtenerPorId(id);
    if (!sala) throw new ValidationError("Sala no encontrada");
    return sala;
  }

  eliminarSala(id: string): void {
    const ok = this.repo.eliminarPorId(id);
    if (!ok) {
      throw new ValidationError(`No se pudo eliminar: sala con ID ${id} no encontrada`);
    }
  }
}
