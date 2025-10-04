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
exports.mostrarMenuLogin = mostrarMenuLogin;
// src/app/menus/menuLogin.ts
const prompts = __importStar(require("@inquirer/prompts"));
const reportgenerator_1 = require("../../utils/reportgenerator");
async function mostrarMenuLogin(usuarioService, deps) {
    const opcion = await prompts.select({
        message: "👤 Bienvenido a nuestro cine",
        choices: [
            { name: "📝 Registrarse", value: "registro" },
            { name: "🔑 Iniciar sesión", value: "login" },
            { name: "❌ Salir", value: "salir" }
        ]
    });
    if (opcion === "registro") {
        const nombre = await prompts.input({ message: "Nombre  (minúsculas,sin espacios y sin carácteres especiales):" });
        const correo = await prompts.input({ message: "Correo:" });
        const password = await prompts.password({ message: "Contraseña:" });
        const rol = await prompts.select({
            message: "Rol:",
            choices: [
                { name: "Administrador", value: "admin" },
                { name: "Cliente", value: "cliente" },
                { name: "Vendedor", value: "vendedor" }
            ]
        });
        try {
            const usuario = usuarioService.registrar(nombre, correo, password, rol);
            console.log(`✅ Usuario ${usuario.getNombre()} registrado (${usuario.getRol()})`);
            return null;
        }
        catch (err) {
            console.error(`❌ Error: ${err.message}`);
            return null;
        }
    }
    if (opcion === "login") {
        const nombre = await prompts.input({ message: "Nombre  (minúsculas,sin espacios y sin carácteres especiales):" });
        const correo = await prompts.input({ message: "Correo:" });
        const password = await prompts.password({ message: "Contraseña:" });
        try {
            const usuario = usuarioService.login(nombre, correo, password);
            console.log(`✅ Bienvenido ${usuario.getNombre()} (${usuario.getRol()})`);
            return usuario;
        }
        catch (err) {
            console.error(`❌ Error: ${err.message}`);
            return null;
        }
    }
    if (opcion === "salir") {
        try {
            const { ventaService, usuarioRepo, peliculaService, funcionService, salaService, comidaService } = deps;
            const ventas = ventaService.listarVentas();
            const usuarios = usuarioRepo.obtenerTodos();
            const peliculas = peliculaService.listarPeliculas();
            const funciones = funcionService.listarFunciones();
            const salas = salaService.listarSalas();
            const comidas = comidaService.listarTodos();
            reportgenerator_1.ReportGenerator.generarReporteVentasJSON(ventas);
            reportgenerator_1.ReportGenerator.generarReporteUsuariosJSON(usuarios);
            reportgenerator_1.ReportGenerator.generarReportePeliculasJSON(peliculas);
            reportgenerator_1.ReportGenerator.generarReporteFuncionesJSON(funciones);
            reportgenerator_1.ReportGenerator.generarReporteSalasJSON(salas);
            reportgenerator_1.ReportGenerator.generarReporteComidasJSON(comidas);
            reportgenerator_1.ReportGenerator.generarReporteCompletoJSON(ventas, usuarios, peliculas, funciones, salas, comidas);
        }
        catch (err) {
            console.error("❌ Error generando reportes:", err?.message ?? String(err));
        }
        console.log("\n✅ Programa finalizado. ¡Hasta luego!\n");
        process.exit(0);
    }
    return null;
}
