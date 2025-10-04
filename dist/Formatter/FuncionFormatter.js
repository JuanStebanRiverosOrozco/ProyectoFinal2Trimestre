"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuncionFormatter = void 0;
const cli_table3_1 = __importDefault(require("cli-table3"));
class FuncionFormatter {
    listarComoTabla(funciones) {
        const table = new cli_table3_1.default({
            head: ["ID", "Película", "Sala", "Fecha", "Precio_por_boleta", "Disponibles"],
            colWidths: [15, 25, 15, 30, 12, 12]
        });
        funciones.forEach(f => {
            table.push([
                f.getId(),
                f.getPelicula().getTitulo(),
                f.getSala().getNombre(),
                f.getFecha().toLocaleString(),
                `$${(f.getPrecio()).toLocaleString()}`,
                f.getAsientosDisponibles()
            ]);
        });
        return table.toString();
    }
}
exports.FuncionFormatter = FuncionFormatter;
