"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.mostrarMenuPeliculas = mostrarMenuPeliculas;
const prompts = __importStar(require("@inquirer/prompts"));
async function mostrarMenuPeliculas(service, peliculaFormatter) {
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
                }
                else {
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
                    const nueva = service.crearPelicula(titulo, duracion, clasificacion, idioma, genero);
                    console.log(`\n✅ Película creada: ${nueva.toString()}`);
                }
                catch (error) {
                    console.error(`\n❌ Error: ${error.message}`);
                }
                break;
            case "eliminar":
                const idEliminar = await prompts.input({ message: "🗑️ ID de la película a eliminar:" });
                try {
                    service.eliminarPelicula(idEliminar);
                    console.log("✅ Película eliminada correctamente.");
                }
                catch (error) {
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
