// src/domain/entidades/ComidaVenta.ts
import { Comida } from "./Comida";
import { Usuario } from "./Usuario";
import { ValidationError } from "../errors/ValidationError";


export class ComidaVenta {
  private id: string;
  private compradorId?: string;
  private compradorNombre: string;
  private compradorCorreo: string;
  private items: Comida[];
  private total: number;

  constructor(id: string,comprador: Usuario | { getNombre: () => string; getCorreo: () => string }, items: Comida[]) {
    if (!items || items.length === 0) throw new ValidationError("La venta debe incluir al menos un producto o combo.");

    this.id = id;
    this.compradorId = (comprador as Usuario).getId ? (comprador as Usuario).getId() : undefined;
    this.compradorNombre = comprador.getNombre();
    this.compradorCorreo = comprador.getCorreo();
    this.items = items;
    this.total = items.reduce((sum, c) => sum + c.getPrecio(), 0);
  }

  getId(): string {
    return this.id;
  }
  getCompradorId(): string | undefined {
    return this.compradorId;
  }
  getCompradorNombre(): string {
    return this.compradorNombre;
  }
  getCompradorCorreo(): string {
    return this.compradorCorreo;
  }
  getItems(): Comida[] {
    return this.items;
  }
  getTotal(): number {
    return this.total;
  }
}
