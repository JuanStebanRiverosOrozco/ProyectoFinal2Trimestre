import { Pelicula } from "../domain/enditades/Pelicula";
import Table from "cli-table3";

export class PeliculaFormatter {
  listarComoTabla(peliculas: Pelicula[]): string {
    const table = new Table({
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
