import { Sala } from "../domain/enditades/Sala";
import Table from "cli-table3";

export class SalaFormatter {
  listarComoTabla(salas: Sala[]): string {
    const table = new Table({
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
