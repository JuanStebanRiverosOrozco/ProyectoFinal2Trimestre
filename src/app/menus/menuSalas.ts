// src/app/menus/menuSalas.ts
import { SalaService } from "../../domain/services/SalaService";
import { TipoSala } from "../../domain/enditades/Sala";
import { SalaFormatter } from "../../Formatter/SalaFormatter";
import * as prompts from "@inquirer/prompts";

export async function mostrarMenuSalas(service: SalaService,salaFormatter: SalaFormatter): Promise<void> {
  let salir = false;

  while (!salir) {
    const opcion = await prompts.select({
      message: "🏟️ Gestión de Salas",
      choices: [
        { name: "📄 Listar salas", value: "listar" },
        { name: "➕ Crear sala", value: "crear" },
        { name: "🗑️ Eliminar sala", value: "eliminar" },
        { name: "🔙 Volver al menú principal", value: "salir" },
      ]
    });

    switch (opcion) {
      case "listar":
        const salas = service.listarSalas();
        if (salas.length === 0) {
          console.log("\n⚠️ No hay salas registradas.\n");
        } else {
          console.log("\n🏟️ Salas registradas:\n");
          console.log(salaFormatter.listarComoTabla(salas));
        }
        break;

      case "crear":
        const nombre = await prompts.input({ message: "🏷️ Nombre de la sala:" });

        const tipo = await prompts.select({
          message: "🎥 Tipo de sala:",
          choices: [
            { name: "2D", value: "2D" },
            { name: "3D", value: "3D" },
            { name: "VIP", value: "VIP" },
          ]
        });

        const filasStr = await prompts.input({ message: "📏 Filas:" });
        const columnasStr = await prompts.input({ message: "📐 Columnas:" });

        const filas = Number(filasStr);
        const columnas = Number(columnasStr);

        try {
          const capacidad = filas * columnas;
          const nueva = service.crearSala(nombre, tipo as TipoSala, capacidad, filas, columnas);
          console.log(`\n✅ Sala creada: ${nueva.toString()} (Filas: ${filas} x Columnas: ${columnas})`);
        } catch (error: any) {
          console.error(`\n❌ Error: ${error.message}`);
        }
        break;

      case "eliminar":
        const idEliminar = await prompts.input({ message: "🗑️ ID de la sala a eliminar:" });
        try {
          service.eliminarSala(idEliminar);
          console.log("✅ Sala eliminada correctamente.");
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
