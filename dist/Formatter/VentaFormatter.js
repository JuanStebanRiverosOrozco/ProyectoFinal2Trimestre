"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentaFormatter = void 0;
const cli_table3_1 = __importDefault(require("cli-table3")); // npm install cli-table3
class VentaFormatter {
    generarFactura(venta) {
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
    listarComoTabla(ventas) {
        const table = new cli_table3_1.default({
            head: ["ID", "Cliente", "Correo", "Película", "Entradas", "Asientos", "Precio_unitario", "Total"],
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
                "$" + (v.getPrecio()).toLocaleString(),
                `$${(total).toLocaleString()}`
            ]);
        });
        return table.toString();
    }
}
exports.VentaFormatter = VentaFormatter;
