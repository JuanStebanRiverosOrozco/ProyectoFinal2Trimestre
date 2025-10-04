// src/domain/enditades/Funcion.ts
import { Pelicula } from "./Pelicula";
import { Sala } from "./Sala";
import { ValidationError } from "../errors/ValidationError";

export class Funcion {
  private id: string;
  private pelicula: Pelicula;
  private sala: Sala;
  private fecha: Date;
  private precio: number;

  // Nueva representación por función: ids de asientos (matriz) y set de ocupados
  private seatIds: string[][] = [];
  private ocupados: Set<string> = new Set<string>();

  constructor(id: string, pelicula: Pelicula, sala: Sala, fecha: Date, precio: number) {
    if (!pelicula) throw new ValidationError("La película es obligatoria.");
    if (!sala) throw new ValidationError("La sala es obligatoria.");
    if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
      throw new ValidationError("La fecha debe ser válida.");
    }
    if (precio <= 0) throw new ValidationError("El precio debe ser mayor que 0.");

    this.id = id;
    this.pelicula = pelicula;
    this.sala = sala;
    this.fecha = fecha;
    this.precio = precio;

    // Inicializa el mapa de asientos a partir de la sala (cada función tiene su propio estado)
    this.inicializarAsientosDesdeSala();
  }

  // ======================
  // Métodos nuevos (asientos por función)
  // ======================
  private inicializarAsientosDesdeSala(): void {
    this.seatIds = this.sala.generarMapaIds();
    this.ocupados = new Set<string>();
  }

  /**
   * Devuelve un número de asientos disponibles (cuenta de los no ocupados)
   */
  getAsientosDisponibles(): number {
    let total = 0;
    for (const fila of this.seatIds) {
      total += fila.length;
    }
    return total - this.ocupados.size;
  }

  /**
   * Devuelve una matriz visual usando iconos (💺 disponible, ❌ ocupado).
   * Útil para mostrar el plano en consola.
   */
  getMapaVisual(): string {
    return this.seatIds
      .map(fila =>
        fila
          .map(id => (this.ocupados.has(id) ? "❌" : "💺"))
          .join(" ")
      )
      .join("\n");
  }

  /**
   * Devuelve una matriz con "ID(icono)" para mostrar filas con detalle
   * Ej: A1(💺) A2(❌) ...
   */
  getMapaConIds(): string {
    return this.seatIds
      .map(fila =>
        fila
          .map(id => `${id}(${this.ocupados.has(id) ? "❌" : "💺"})`)
          .join(" ")
      )
      .join("\n");
  }

  /**
   * Lista los IDs de asientos disponibles (flat)
   */
  listarAsientosDisponibles(): string[] {
    const disponibles: string[] = [];
    for (const fila of this.seatIds) {
      for (const id of fila) {
        if (!this.ocupados.has(id)) disponibles.push(id);
      }
    }
    return disponibles;
  }

  /**
   * Retorna info simple sobre un asiento por su ID
   */
  getAsientoPorId(id: string): { id: string; disponible: boolean } | undefined {
    for (const fila of this.seatIds) {
      for (const seatId of fila) {
        if (seatId === id) {
          return { id: seatId, disponible: !this.ocupados.has(seatId) };
        }
      }
    }
    return undefined;
  }

  /**
   * Ocupa un asiento por su ID. Retorna true si lo ocupó, false si ya estaba ocupado o no existe.
   */
  ocuparAsiento(id: string): boolean {
    const asiento = this.getAsientoPorId(id);
    if (!asiento) return false;
    if (!asiento.disponible) return false;
    this.ocupados.add(id);
    return true;
  }

  /**
   * Método de compatibilidad: resta 'cantidad' ocupando los primeros asientos libres.
   */
  restarAsientos(cantidad: number): void {
    if (cantidad <= 0) {
      throw new ValidationError("La cantidad debe ser mayor a 0.");
    }
    const disponibles = this.listarAsientosDisponibles();
    if (cantidad > disponibles.length) {
      throw new ValidationError("No hay suficientes asientos.");
    }
    for (let i = 0; i < cantidad; i++) {
      this.ocupados.add(disponibles[i]);
    }
  }

  // ======================
  // Getters originales (no eliminados)
  // ======================
  getId(): string {
    return this.id;
  }

  getPelicula(): Pelicula {
    return this.pelicula;
  }

  getSala(): Sala {
    return this.sala;
  }

  getFecha(): Date {
    return this.fecha;
  }

  getPrecio(): number {
    return this.precio;
  }

  getAsientosVendidos(): number {
    return this.ocupados.size;
  }

  toString(): string {
    const fechaStr = this.fecha.toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${this.pelicula.getTitulo()} | Sala: ${this.sala.getNombre()} | ${fechaStr} | Precio_Unitario: $${(this.precio).toLocaleString()} | Disp: ${this.getAsientosDisponibles()}`;
  }
}
