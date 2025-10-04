// src/domain/services/FuncionService.ts
import { Funcion } from "../enditades/Funcion";
import { Pelicula } from "../enditades/Pelicula";
import { Sala } from "../enditades/Sala";
import { IFuncionRepository } from "../interFaces/IfuncionRepository";
import { ValidationError } from "../errors/ValidationError";
import { IdGenerator } from "./IdGenerator";

export class FuncionService {
  constructor(private readonly repo: IFuncionRepository) { }

  crearFuncion(
    pelicula: Pelicula,
    sala: Sala,
    fecha: Date,
    precio: number
  ): Funcion {
    if (fecha.getTime() < Date.now()) {
      throw new ValidationError("La función no puede estar en el pasado.");
    }

    if (precio <= 0) {
      throw new ValidationError("El precio debe ser mayor a 0.");
    }

    // ✅ Validar si ya existe una función misma película + sala + fecha/hora
    const funcionesExistentes = this.repo.obtenerTodas();
    const duplicada = funcionesExistentes.some(f =>
      f.getPelicula().getId() === pelicula.getId() &&
      f.getSala().getId() === sala.getId() &&
      f.getFecha().getTime() === fecha.getTime()
    );

    if (duplicada) {
      throw new ValidationError(
        "Ya existe una función para esta película en la misma sala, fecha y hora."
      );
    }

    const id = IdGenerator.next("Funcion");
    const nueva = new Funcion(id, pelicula, sala, fecha, precio);
    // Funcion constructor ya inicializa asientos desde la sala
    this.repo.guardar(nueva);
    return nueva;
  }

  listarFunciones(): Funcion[] {
    return this.repo.obtenerTodas();
  }

  buscarFuncionPorId(id: string): Funcion {
    const funcion = this.repo.obtenerPorId(id);
    if (!funcion) {
      throw new ValidationError(`No existe una función con ID ${id}`);
    }
    return funcion;
  }

  eliminarFuncion(id: string): void {
    const eliminado = this.repo.eliminarPorId(id);
    if (!eliminado) {
      throw new ValidationError(`No se encontró la función con ID ${id}`);
    }
  }
}
