// src/domain/enditades/Sala.ts
import { ValidationError } from "../errors/ValidationError";

export type TipoSala = "2D" | "3D" | "VIP";

export class Sala {
  private readonly id: string;
  private nombre: string;
  private tipo: TipoSala;
  private capacidad: number;
  private filas: number;
  private columnas: number;

  constructor(
    id: string,
    nombre: string,
    tipo: TipoSala,
    capacidad: number,
    filas?: number,
    columnas?: number
  ) {
    if (!nombre || nombre.trim() === "") {
      throw new ValidationError("El nombre de la sala es obligatorio.");
    }
    if (!["2D", "3D", "VIP"].includes(tipo)) {
      throw new ValidationError("El tipo de sala no es válido.");
    }
    if (capacidad <= 0) {
      throw new ValidationError("La capacidad debe ser mayor a 0.");
    }

    // Si no se pasan filas/columnas, se asume 1 fila x capacidad (retrocompatibilidad)
    if (!filas || !columnas) {
      filas = 1;
      columnas = capacidad;
    }

    if (filas <= 0 || columnas <= 0) {
      throw new ValidationError("La sala debe tener al menos 1 fila y 1 columna.");
    }

    if (filas * columnas !== capacidad) {
      throw new ValidationError("La capacidad debe coincidir con filas x columnas.");
    }

    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
    this.capacidad = capacidad;
    this.filas = filas;
    this.columnas = columnas;
  }

  // Getters originales
  getId(): string {
    return this.id;
  }

  getNombre(): string {
    return this.nombre;
  }

  getTipo(): TipoSala {
    return this.tipo;
  }

  getCapacidad(): number {
    return this.capacidad;
  }

  // Nuevos getters para filas/columnas
  getFilas(): number {
    return this.filas;
  }

  getColumnas(): number {
    return this.columnas;
  }

  toString(): string {
    return `${this.nombre} (${this.tipo}) - Capacidad: ${this.capacidad}`;
  }

  /**
   * Genera la matriz de IDs de asientos (etiquetas): A1, A2, ..., B1, ...
   * Devuelve una matriz [fila][columna] de strings (IDs).
   */
  generarMapaIds(): string[][] {
    const map: string[][] = [];
    const startCharCode = "A".charCodeAt(0);
    for (let r = 0; r < this.filas; r++) {
      const fila: string[] = [];
      const rowLetter = String.fromCharCode(startCharCode + r);
      for (let c = 1; c <= this.columnas; c++) {
        fila.push(`${rowLetter}${c}`);
      }
      map.push(fila);
    }
    return map;
  }
}
