"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeliculaFormatter = void 0;
const cli_table3_1 = __importDefault(require("cli-table3"));
class PeliculaFormatter {
    listarComoTabla(peliculas) {
        const table = new cli_table3_1.default({
            head: ["ID", "Título", "Duración (min)", "Clasificación", "Género"],
            colWidths: [15, 25, 15, 15, 15]
        });
        peliculas.forEach(p => {
            table.push([
                p.getId(),
                p.getTitulo(),
                p.getDuracion(),
                p.getClasificacion(),
                p.getGenero()
            ]);
        });
        return table.toString();
    }
}
exports.PeliculaFormatter = PeliculaFormatter;
