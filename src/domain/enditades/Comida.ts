// src/domain/enditades/Comida.ts
import { ValidationError } from "../errors/ValidationError";

export type TipoCombo = "economico" | "familiar" | "premium" | null;


export class Comida {
  private id: string;
  private nombre: string;
  private precio: number;
  private productos: Comida[]; // si es combo, aquí están los productos incluidos
  private tipoCombo: TipoCombo;
  private descuento: number; // porcentaje (ej: 10 = 10%)

  constructor(
    id: string,
    nombre: string,
    precio: number,
    productos: Comida[] = [],
    tipoCombo: TipoCombo = null
  ) {
    if (!nombre || nombre.trim() === "") {
      throw new ValidationError("El nombre de la comida no puede estar vacío.");
    }

    // Si NO es combo se requiere un precio válido
    if ((!productos || productos.length === 0) && (isNaN(precio) || precio <= 0)) {
      throw new ValidationError("El precio debe ser un número válido mayor que 0 para productos.");
    }

    this.id = id;
    this.nombre = nombre;
    this.productos = productos;
    this.tipoCombo = tipoCombo;

    // asignar porcentaje de descuento según tipoCombo
    switch (tipoCombo) {
      case "economico":
        this.descuento = 10;
        break;
      case "familiar":
        this.descuento = 20;
        break;
      case "premium":
        this.descuento = 30;
        break;
      default:
        this.descuento = 0;
    }

    // si es combo, calcular precio automáticamente con el descuento aplicado sobre la suma de precios base
    if (this.esCombo()) {
      const precioBase = this.productos.reduce((s, p) => s + p.getPrecio(), 0);
      const descuentoAplicado = (precioBase * this.descuento) / 100;
      this.precio = Math.round(precioBase - descuentoAplicado);
    } else {
      this.precio = precio;
    }
  }

  getId(): string {
    return this.id;
  }

  getNombre(): string {
    return this.nombre;
  }

  getPrecio(): number {
    return this.precio;
  }

  getProductos(): Comida[] {
    return this.productos;
  }

  getTipoCombo(): TipoCombo {
    return this.tipoCombo;
  }

  getDescuento(): number {
    return this.descuento;
  }

  esCombo(): boolean {
    return !!(this.productos && this.productos.length > 0);
  }

  toString(): string {
    if (this.esCombo()) {
      const base = this.productos.reduce((s, p) => s + p.getPrecio(), 0);
      const items = this.productos.map(p => `- ${p.getNombre()} ($${p.getPrecio()})`).join("\n");
      return `🍱 Combo: ${this.nombre} (${this.tipoCombo ?? "-"}) — $${(this.precio).toLocaleString()} (base $${base}, desc ${(this.descuento).toLocaleString()}%)\nIncluye:\n${items}`;
    }
    return `🥤 Producto: ${this.nombre} — $${(this.precio).toLocaleString()}`;
  }
}
