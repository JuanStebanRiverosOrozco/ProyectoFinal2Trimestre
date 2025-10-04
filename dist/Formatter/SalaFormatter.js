"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaFormatter = void 0;
const cli_table3_1 = __importDefault(require("cli-table3"));
class SalaFormatter {
    listarComoTabla(salas) {
        const table = new cli_table3_1.default({
            head: ["ID", "Nombre", "Tipo", "Capacidad"],
            colWidths: [15, 25, 10, 12]
        });
        salas.forEach(s => {
            table.push([
                s.getId(),
                s.getNombre(),
                s.getTipo(),
                s.getCapacidad(),
            ]);
        });
        return table.toString();
    }
}
exports.SalaFormatter = SalaFormatter;
