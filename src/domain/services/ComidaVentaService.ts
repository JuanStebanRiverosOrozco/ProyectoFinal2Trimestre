// src/domain/services/ComidaVentaService.ts
import { Comida } from "../enditades/Comida";
import { ComidaVenta } from "../enditades/ComidaVenta";
import { ComidaService } from "./ComidaService";
import { Usuario } from "../enditades/Usuario";
import { ValidationError } from "../errors/ValidationError";
import { IdGenerator } from "./IdGenerator";

export class ComidaVentaService {
  private ventas: ComidaVenta[] = [];

  realizarVenta(
    comprador: Usuario | { getNombre: () => string; getCorreo: () => string },
    seleccionados: string[],
    comidaService: ComidaService
  ): ComidaVenta {
    if (!seleccionados || seleccionados.length === 0) throw new ValidationError("Debe seleccionar al menos un producto.");

    const items: Comida[] = [];
    for (const id of seleccionados) {
      const item = comidaService.buscarPorId(id);
      if (!item) throw new ValidationError(`El producto/combo con ID ${id} no existe.`);
      items.push(item);
    }

    const id = IdGenerator.next("ComidaVenta");
    const venta = new ComidaVenta(id, comprador, items);
    this.ventas.push(venta);
    return venta;
  }

  listarVentas(): ComidaVenta[] {
    return this.ventas;
  }

  listarVentasPorUsuario(usuarioId: string): ComidaVenta[] {
    return this.ventas.filter((v) => v.getCompradorId() === usuarioId);
  }
}
