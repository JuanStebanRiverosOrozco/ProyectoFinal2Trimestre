// src/domain/services/ComidaService.ts
import { Comida, TipoCombo } from "../enditades/Comida";
import { ValidationError } from "../errors/ValidationError";
import { IdGenerator } from "./IdGenerator";

export class ComidaService {
  private comidas: Comida[] = [];

  crearProducto(nombre: string, precio: number): Comida {
    const id = IdGenerator.next("Comida");
    const comida = new Comida(id, nombre, precio);
    this.comidas.push(comida);
    return comida;
  }

  crearCombo(nombre: string, productosIds: string[], tipoCombo: TipoCombo): Comida {
    if (productosIds.length === 0 || productosIds.length === 1) {
      throw new ValidationError("Un combo debe incluir al menos dos producto.");
    }

    const productos = this.comidas.filter((c) => productosIds.includes(c.getId()));
    if (productos.length !== productosIds.length) {
      throw new ValidationError("Algunos productos no existen.");
    }

    // Normalizar nombre: quita acentos, espacios, guiones, underscores y normaliza números
    const normalizar = (s: string) =>
      s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")     // quitar tildes
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")           // quitar todo lo que no sea letra/dígito
        .replace(/(\d+)/g, (m) => String(Number(m))); // normalizar números

    const nombreNormalizado = normalizar(nombre);

    // 🔹 Buscar colisión por nombre + tipoCombo
    const existe = this.comidas.some((c) => {
      if (!c.esCombo()) return false;
      const mismoTipo = c.getTipoCombo() === tipoCombo;
      const nombreSimilar = normalizar(c.getNombre()) === nombreNormalizado;
      return mismoTipo && nombreSimilar;
    });

    if (existe) {
      throw new ValidationError(
        `Ya existe un combo con nombre similar ("${nombre}") y tipo "${tipoCombo}".`
      );
    }

    const id = IdGenerator.next("Comida");
    const combo = new Comida(id, nombre, 0, productos, tipoCombo);
    this.comidas.push(combo);
    return combo;
  }



  listarProductos(): Comida[] {
    return this.comidas.filter((c) => !c.esCombo());
  }

  listarCombos(): Comida[] {
    return this.comidas.filter((c) => c.esCombo());
  }

  listarTodos(): Comida[] {
    return this.comidas;
  }

  buscarPorId(id: string): Comida | undefined {
    return this.comidas.find((c) => c.getId() === id);
  }
}
