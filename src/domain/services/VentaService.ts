// src/domain/services/VentaService.ts
import { Venta } from "../enditades/Venta";
import { IVentaRepository } from "../interFaces/IVentaRepository";
import { FuncionService } from "./FuncionService";
import { ValidationError } from "../errors/ValidationError";
import { IdGenerator } from "./IdGenerator";
import { Usuario } from "../enditades/Usuario";

export class VentaService {
  private repo: IVentaRepository;

  constructor(repo: IVentaRepository) {
    this.repo = repo;
  }

  realizarVenta(
    usuario: Usuario,
    funcionId: string,
    asientosIds: string[],
    funcionService: FuncionService,
    nombre?: string,// 👈 opcional, para cuando un vendedor vende a un cliente externo
    correo?: string
  ): Venta {
    const funcion = funcionService.buscarFuncionPorId(funcionId);

    if (!funcion) {
      throw new ValidationError("Función no encontrada.");
    }

    if (!asientosIds || asientosIds.length === 0) {
      throw new ValidationError("Debes seleccionar al menos un asiento.");
    }

    // Verificar existencia y disponibilidad
    for (const id of asientosIds) {
      const asientoInfo = funcion.getAsientoPorId(id);
      if (!asientoInfo) {
        throw new ValidationError(`El asiento con ID ${id} no existe.`);
      }
      if (!asientoInfo.disponible) {
        throw new ValidationError(`El asiento ${id} ya está ocupado.`);
      }
    }

    // Ocupar asientos (se marca en la función)
    for (const id of asientosIds) {
      const ok = funcion.ocuparAsiento(id);
      if (!ok) {
        // Esto no debería ocurrir por la verificación previa, pero lo manejamos
        throw new ValidationError(`No se pudo ocupar el asiento ${id}.`);
      }
    }


    // Crear la venta
    const id = IdGenerator.next("Venta");
    const venta = new Venta(id, funcion, asientosIds.length, asientosIds, usuario.getId(), nombre || usuario.getNombre(), correo || usuario.getCorreo());
    this.repo.guardar(venta);
    return venta;
  }

  listarVentas(): Venta[] {
    return this.repo.obtenerTodas();
  }
  // 🔹 Nuevo método: listar ventas de un usuario
  listarVentasPorUsuario(usuarioId: string): Venta[] {
    return this.repo.obtenerTodas().filter(v => v.getUsuarioId() === usuarioId);
  }
}
