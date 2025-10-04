// src/domain/enditades/Venta.ts
import { Funcion } from "./Funcion";
import { ValidationError } from "../errors/ValidationError";

export class Venta {
  private readonly id: string;
  private funcion: Funcion;
  private cantidad: number;
  private total: number;
  private precio:number;
  private readonly fecha: Date;
  private asientosIds: string[]; // nuevos: asientos vendidos (IDs)
  private readonly usuarioId: string;
  private readonly usuarioNombre: string;
  private readonly usuarioCorreo: string;

  constructor(id: string, funcion: Funcion, cantidad: number, asientosIds: string[] = [], usuarioId: string, usuarioNombre: string ,usuarioCorreo: string) {
    if (!funcion) {
      throw new ValidationError("La función no puede estar vacía.");
    }
    if (cantidad <= 0) {
      throw new ValidationError("La cantidad de entradas debe ser mayor a 0.");
    }

    // si asientosIds se pasó, ajustar cantidad para consistencia
    if (asientosIds.length > 0 && asientosIds.length !== cantidad) {
      // preferimos confiar en los asientos provistos: ajustar cantidad al length
      cantidad = asientosIds.length;
    }

    this.id = id;
    this.funcion = funcion;
    this.cantidad = cantidad;
    this.asientosIds = asientosIds;
    this.usuarioId = usuarioId;
    this.precio = funcion.getPrecio();
    this.total = funcion.getPrecio() * this.cantidad;
    this.fecha = new Date();
    this.usuarioNombre = usuarioNombre;
    this.usuarioCorreo = usuarioCorreo;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getFuncion(): Funcion {
    return this.funcion;
  }

  getCantidad(): number {
    return this.cantidad;
  }

  getPrecio():number{
    return this.precio;
  }

  getTotal(): number {
    return this.total;
  }

  getFecha(): Date {
    return this.fecha;
  }

  getAsientosIds(): string[] {
    return this.asientosIds;
  }

  getUsuarioId() {
    return this.usuarioId;
  }

  getNombre(): string | undefined { 
    return this.usuarioNombre; 
  }
  
  getCorreo(): string | undefined { 
    return this.usuarioCorreo; 
  }

  toString(): string {
    const asientosStr = this.asientosIds && this.asientosIds.length > 0 ? ` Asientos: [${this.asientosIds.join(", ")}]` : "";
    return `Venta #${this.id} - ${this.cantidad} entradas para ${this.funcion.getPelicula().getTitulo()} - Total: $${(this.total).toLocaleString()}${asientosStr}`;
  }
}
