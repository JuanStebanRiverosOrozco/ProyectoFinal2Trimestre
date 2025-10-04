import { Venta } from "../domain/enditades/Venta";
import Table from "cli-table3"; // npm install cli-table3

export class VentaFormatter {
    generarFactura(venta: Venta): string {
        const subtotal = venta.getTotal();
        const iva = subtotal * 0.19;
        const total = subtotal + iva;

        return `
🧾 FACTURA DE VENTA
----------------------------------------
ID Venta: ${venta.getId()}
Cliente: ${venta.getNombre()}
Correo: ${venta.getCorreo()}
Función: ${venta.getFuncion().getPelicula().getTitulo()}
Entradas: ${venta.getAsientosIds().length}
Asientos: ${venta.getAsientosIds().join(", ")}
----------------------------------------
Precio Unitario: $${(venta.getPrecio()).toLocaleString()}
Subtotal: $${(subtotal).toLocaleString()}
IVA (19%): $${(iva).toLocaleString()}
TOTAL: $${(total).toLocaleString()}
`;
    }

    listarComoTabla(ventas: Venta[]): string {
        const table = new Table({
            head: ["ID", "Cliente", "Correo", "Película", "Entradas", "Asientos","Precio_unitario", "Total"],
            colWidths: [15, 15, 15, 20, 10, 20, 20, 15]
        });

        ventas.forEach(v => {
            const subtotal = v.getTotal();
            const iva = subtotal * 0.19;
            const total = subtotal + iva;
            table.push([
                v.getId(),
                v.getNombre() ?? "-",
                v.getCorreo() ?? "-",
                v.getFuncion().getPelicula().getTitulo(),
                v.getAsientosIds().length,
                v.getAsientosIds().join(", "),
                "$"+(v.getPrecio()).toLocaleString(),
                `$${(total).toLocaleString()}`
            ]);
        });

        return table.toString();
    }
}
