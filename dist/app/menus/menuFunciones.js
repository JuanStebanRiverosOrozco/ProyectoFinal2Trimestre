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
exports.mostrarMenuFunciones = mostrarMenuFunciones;
const prompts = __importStar(require("@inquirer/prompts"));
const date_fns_1 = require("date-fns");
async function mostrarMenuFunciones(funcionService, peliculaService, salaService, funcionFormatter) {
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
                }
                else {
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
                const fecha = (0, date_fns_1.parse)(fechaStr, "yyyy-MM-dd HH:mm", new Date());
                try {
                    const precioStr = await prompts.input({ message: "💲 Precio de la entrada:" });
                    const precio = Number(precioStr);
                    const pelicula = peliculaService.buscarPeliculaPorId(peliculaId);
                    const sala = salaService.buscarSalaPorId(salaId);
                    const nueva = funcionService.crearFuncion(pelicula, sala, fecha, precio);
                    console.log(`\n✅ Función creada: ${nueva.toString()}`);
                }
                catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                }
                break;
            case "eliminar":
                const idEliminar = await prompts.input({ message: "🗑️ ID de la función a eliminar:" });
                try {
                    funcionService.eliminarFuncion(idEliminar);
                    console.log("✅ Función eliminada correctamente.");
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
