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
exports.mostrarMenuSalas = mostrarMenuSalas;
const prompts = __importStar(require("@inquirer/prompts"));
async function mostrarMenuSalas(service, salaFormatter) {
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
                }
                else {
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
                    const nueva = service.crearSala(nombre, tipo, capacidad, filas, columnas);
                    console.log(`\n✅ Sala creada: ${nueva.toString()} (Filas: ${filas} x Columnas: ${columnas})`);
                }
                catch (error) {
                    console.error(`\n❌ Error: ${error.message}`);
                }
                break;
            case "eliminar":
                const idEliminar = await prompts.input({ message: "🗑️ ID de la sala a eliminar:" });
                try {
                    service.eliminarSala(idEliminar);
                    console.log("✅ Sala eliminada correctamente.");
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
