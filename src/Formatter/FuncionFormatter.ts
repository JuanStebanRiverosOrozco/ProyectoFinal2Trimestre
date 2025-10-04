import { Funcion } from "../domain/enditades/Funcion";
import Table from "cli-table3";

export class FuncionFormatter {
  listarComoTabla(funciones: Funcion[]): string {
    const table = new Table({
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
