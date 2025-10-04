// src/Formatter/ComidaFormatter.ts
import { Comida } from "../domain/enditades/Comida";
import { ComidaVenta } from "../domain/enditades/ComidaVenta";
import Table from "cli-table3"; // npm i cli-table3

export class ComidaFormatter {
  listarProductos(productos: Comida[]): string {
    if (productos.length === 0) return "No hay productos disponibles.";
    let salida = "ID | Producto | Precio\n";
    productos.forEach(p => {
      salida += `${p.getId()} | ${p.getNombre()} | $${p.getPrecio()}\n`;
    });
    return salida;
  }

  listarCombos(combos: Comida[]): string {
    if (combos.length === 0) return "No hay combos disponibles.";
    const table = new Table({
      head: ["ID", "Combo", "Tipo", "Precio final", "Precio base", "Descuento %", "Incluye"],
      colWidths: [12, 22, 12, 15, 15, 12, 35],
    });

    combos.forEach(c => {
      const base = c.getProductos().reduce((s, p) => s + p.getPrecio(), 0);
      table.push([
        c.getId(),
        c.getNombre(),
        c.getTipoCombo() ?? "-",
        `$${(c.getPrecio()).toLocaleString()}`,
        `$${(base).toLocaleString()}`,
        `${(c.getDescuento()).toLocaleString()}%`,
        c.getProductos().map(p => p.getNombre()).join(", "),
      ]);
    });

    return table.toString();
  }

  listarProductosYCombos(items: Comida[]): string {
    const table = new Table({
      head: ["ID", "Nombre", "Tipo", "TipoCombo", "Precio final", "Precio base (si combo)", "Items"],
      colWidths: [10, 25, 12, 12, 12, 15, 35],
    });

    items.forEach(c => {
      if (c.esCombo()) {
        const base = c.getProductos().reduce((s, p) => s + p.getPrecio(), 0);
        table.push([
          c.getId(),
          c.getNombre(),
          "combo",
          c.getTipoCombo() ?? "-",
          `$${(c.getPrecio()).toLocaleString()}`,
          `$${(base).toLocaleString()}`,
          c.getProductos().map(p => p.getNombre()).join(", "),
        ]);
      } else {
        table.push([c.getId(), c.getNombre(), "producto", "-", `$${(c.getPrecio()).toLocaleString()}`, "-", "-"]);
      }
    });

    return table.toString();
  }

  generarFactura(venta: ComidaVenta): string {
    // calculamos subtotal base (sin descuentos), descuento total, subtotal después de descuento, IVA y total
    const subtotalBase = venta.getItems().reduce((acc, i) => {
      if (i.esCombo()) {
        return acc + i.getProductos().reduce((s, p) => s + p.getPrecio(), 0);
      }
      return acc + i.getPrecio();
    }, 0);

    const descuentoTotal = venta.getItems().reduce((acc, i) => {
      if (i.esCombo()) {
        const base = i.getProductos().reduce((s, p) => s + p.getPrecio(), 0);
        return acc + (base * i.getDescuento()) / 100;
      }
      return acc;
    }, 0);

    const subtotalConDescuento = subtotalBase - descuentoTotal;
    const iva = +(subtotalConDescuento * 0.19).toFixed(0);
    const total = subtotalConDescuento + iva;

    const itemsDetalle = venta.getItems().map(i => {
      if (i.esCombo()) {
        const base = i.getProductos().reduce((s, p) => s + p.getPrecio(), 0);
        const contenido = i.getProductos().map(p => `   - ${p.getNombre()} ($${(p.getPrecio()).toLocaleString()})`).join("\n");
        return `• ${i.getNombre()} — $${((i.getPrecio().toLocaleString()))} (base $${(base).toLocaleString()} - ${i.getDescuento()}%)\n${contenido}`;
      }
      return `• ${i.getNombre()} — $${(i.getPrecio()).toLocaleString()}`;
    }).join("\n");

    return `
🧾 FACTURA COMIDA
----------------------------------------
ID Venta: ${venta.getId()}
Cliente: ${venta.getCompradorNombre()}
Correo: ${venta.getCompradorCorreo()}
----------------------------------------
${itemsDetalle}
----------------------------------------
Subtotal (sin descuento): $${(subtotalBase).toLocaleString()}
Descuento total: -$${(descuentoTotal).toLocaleString()}
Subtotal (con descuento): $${(subtotalConDescuento).toLocaleString()}
IVA (19%): $${(iva).toLocaleString()}
TOTAL: $${(total).toLocaleString()}
`;
  }

  listarComoTabla(ventas: ComidaVenta[]): string {
    const table = new Table({
      head: ["ID", "Cliente", "Correo", "Items", "Subtotal base", "Descuento", "IVA", "Total"],
      colWidths: [12, 20, 22, 40, 15, 15, 12, 15],
    });

    ventas.forEach(v => {
      const subtotalBase = v.getItems().reduce((acc, i) => {
        if (i.esCombo()) return acc + i.getProductos().reduce((s, p) => s + p.getPrecio(), 0);
        return acc + i.getPrecio();
      }, 0);

      const descuentoTotal = v.getItems().reduce((acc, i) => {
        if (i.esCombo()) {
          const base = i.getProductos().reduce((s, p) => s + p.getPrecio(), 0);
          return acc + (base * i.getDescuento()) / 100;
        }
        return acc;
      }, 0);

      const subtotalConDescuento = subtotalBase - descuentoTotal;
      const iva = +(subtotalConDescuento * 0.19).toFixed(0);
      const total = subtotalConDescuento + iva;

      const detalle = v.getItems().map(i => i.esCombo() ? `${i.getNombre()} [${i.getProductos().map(p => p.getNombre()).join(", ")}]` : i.getNombre()).join(", ");

      table.push([
        v.getId(),
        v.getCompradorNombre(),
        v.getCompradorCorreo(),
        detalle,
        `$${(subtotalBase).toLocaleString()}`,
        `-$${(descuentoTotal).toLocaleString()}`,
        `$${(iva).toLocaleString()}`,
        `$${(total).toLocaleString()}`,
      ]);
    });

    return table.toString();
  }
}
