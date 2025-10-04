// src/app/menus/menuFunciones.ts
import { FuncionService } from "../../domain/services/FuncionService";
import { PeliculaService } from "../../domain/services/PeliculaService";
import { SalaService } from "../../domain/services/SalaService";
import { FuncionFormatter } from "../../Formatter/FuncionFormatter";
import * as prompts from "@inquirer/prompts";
import { parse } from "date-fns";

export async function mostrarMenuFunciones(
  funcionService: FuncionService,
  peliculaService: PeliculaService,
  salaService: SalaService,
  funcionFormatter: FuncionFormatter
): Promise<void> {
  let salir = false;

  while (!salir) {
    const opcion = await prompts.select({
      message: "📅 Gestión de Funciones",
      choices: [
        { name: "📄 Listar funciones", value: "listar" },
        { name: "➕ Crear función", value: "crear" },
        { name: "🗑️ Eliminar función", value: "eliminar" },
        { name: "🔙 Volver al menú principal", value: "salir" },
      ]
    });

    switch (opcion) {
      case "listar":
        const funciones = funcionService.listarFunciones();
        if (funciones.length === 0) {
          console.log("\n⚠️ No hay funciones registradas.\n");
        } else {
          console.log("\n📅 Funciones programadas:\n");
          console.log(funcionFormatter.listarComoTabla(funciones));
        }
        break;

      case "crear":
        const peliculas = peliculaService.listarPeliculas();
        const salas = salaService.listarSalas();

        if (peliculas.length === 0 || salas.length === 0) {
          console.log("\n⚠️ Debes tener al menos una película y una sala para crear funciones.\n");
          break;
        }

        const peliculaId = await prompts.select({
          message: "🎬 Selecciona una película:",
          choices: peliculas.map(p => ({
            name: p.toString(),
            value: p.getId()
          }))
        });

        const salaId = await prompts.select({
          message: "🏟️ Selecciona una sala:",
          choices: salas.map(s => ({
            name: `${s.toString()} (Filas:${s.getFilas()}xCols:${s.getColumnas()})`,
            value: s.getId()
          }))
        });

        const fechaStr = await prompts.input({
          message: "📅 Fecha y hora (formato: YYYY-MM-DD HH:mm):"
        });

        const fecha = parse(fechaStr, "yyyy-MM-dd HH:mm", new Date());

        try {
          const precioStr = await prompts.input({ message: "💲 Precio de la entrada:" });
          const precio = Number(precioStr);
          const pelicula = peliculaService.buscarPeliculaPorId(peliculaId);
          const sala = salaService.buscarSalaPorId(salaId);

          const nueva = funcionService.crearFuncion(pelicula, sala, fecha, precio);
          console.log(`\n✅ Función creada: ${nueva.toString()}`);
        } catch (error: any) {
          console.error(`❌ Error: ${error.message}`);
        }

        break;

      case "eliminar":
        const idEliminar = await prompts.input({ message: "🗑️ ID de la función a eliminar:" });
        try {
          funcionService.eliminarFuncion(idEliminar);
          console.log("✅ Función eliminada correctamente.");
        } catch (error: any) {
          console.error(`❌ Error: ${error.message}`);
        }
        break;

      case "salir":
        salir = true;
        break;
    }

    if (!salir) {
      await prompts.input({ message: "\nPresiona ENTER para continuar..." });
      console.clear();
    }
  }
}
