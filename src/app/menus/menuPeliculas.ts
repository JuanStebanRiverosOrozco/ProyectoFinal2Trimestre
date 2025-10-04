// src/app/menus/menuPeliculas.ts
import { PeliculaService } from "../../domain/services/PeliculaService";
import { Clasificacion, Genero, Idioma } from "../../domain/enditades/Pelicula";
import { PeliculaFormatter } from "../../Formatter/PeliculaFormatter";
import * as prompts from "@inquirer/prompts";

export async function mostrarMenuPeliculas(service: PeliculaService, peliculaFormatter: PeliculaFormatter): Promise<void> {
  let salir = false;

  while (!salir) {
    const opcion = await prompts.select({
      message: "🎬 Gestión de Películas",
      choices: [
        { name: "📄 Listar películas", value: "listar" },
        { name: "➕ Crear película", value: "crear" },
        { name: "🗑️ Eliminar película", value: "eliminar" },
        { name: "🔙 Volver al menú principal", value: "salir" },
      ]
    });

    switch (opcion) {
      case "listar":
        const peliculas = service.listarPeliculas();
        if (peliculas.length === 0) {
          console.log("\n⚠️ No hay películas registradas.\n");
        } else {
          console.log("\n🎞️ Películas registradas:\n");
          console.log(peliculaFormatter.listarComoTabla(peliculas));
        }
        break;

      case "crear":
        const titulo = await prompts.input({ message: "🎬 Título de la película:" });
        const duracionStr = await prompts.input({ message: "⏱️ Duración en minutos:" });
        const duracion = Number(duracionStr);

        const clasificacion = await prompts.select({
          message: "🎟️ Clasificación:",
          choices: [
            { name: "G (todas las edades)", value: "G" },
            { name: "PG", value: "PG" },
            { name: "PG-13", value: "PG-13" },
            { name: "R", value: "R" },
            { name: "NC-17", value: "NC-17" },
          ],
        });

        const idioma = await prompts.select({
          message: "🌍 Idioma:",
          choices: [
            { name: "Español", value: "Español" },
            { name: "Inglés", value: "Inglés" },
            { name: "Subtitulada", value: "Subtitulada" },
            { name: "Doblada", value: "Doblada" },
          ],
        });

        const genero = await prompts.select({
          message: "🎭 Género:",
          choices: [
            { name: "Acción", value: "Acción" },
            { name: "Comedia", value: "Comedia" },
            { name: "Drama", value: "Drama" },
            { name: "Terror", value: "Terror" },
            { name: "Animación", value: "Animación" },
          ],
        });

        try {
          const nueva = service.crearPelicula(
            titulo,
            duracion,
            clasificacion as Clasificacion,
            idioma as Idioma,
            genero as Genero
          );
          console.log(`\n✅ Película creada: ${nueva.toString()}`);
        } catch (error: any) {
          console.error(`\n❌ Error: ${error.message}`);
        }
        break;

      case "eliminar":
        const idEliminar = await prompts.input({ message: "🗑️ ID de la película a eliminar:" });
        try {
          service.eliminarPelicula(idEliminar);
          console.log("✅ Película eliminada correctamente.");
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
