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
exports.mostrarMenuPrincipal = mostrarMenuPrincipal;
// src/app/menus/menuPrincipal.ts
const prompts = __importStar(require("@inquirer/prompts"));
const menuVentas_1 = require("./menuVentas");
const menuSalas_1 = require("./menuSalas");
const menuPeliculas_1 = require("./menuPeliculas");
const menuFunciones_1 = require("./menuFunciones");
const menuComida_1 = require("./menuComida"); // 👈 ya está
/**
 * Devuelve "logout" si el usuario cierra sesión (vuelve al login)
 * Devuelve "exit" si el usuario quiere terminar el programa
 */
async function mostrarMenuPrincipal(usuario, servicios) {
    while (true) {
        const opcion = await prompts.select({
            message: `👤 ${usuario.getNombre()} (${usuario.getRol()}) - Menú`,
            choices: usuario.getRol() === "admin"
                ? [
                    { name: "🎬 Gestionar Películas", value: "peliculas" },
                    { name: "🏟️ Gestionar Salas", value: "salas" },
                    { name: "📅 Gestionar Funciones", value: "funciones" },
                    { name: "🎟️ Gestionar Ventas", value: "ventas" },
                    { name: "🍿 Gestionar Comida", value: "comida" }, // 👈 admin gestiona productos/combos
                    { name: "🚪 Cerrar sesión", value: "logout" },
                    { name: "❌ Salir del sistema", value: "exit" },
                ]
                : usuario.getRol() === "vendedor"
                    ? [
                        { name: "🎟️ Vender Boletos", value: "ventas" },
                        { name: "🍿 Vender Comida", value: "comida" }, // 👈 vendedor vende comida
                        { name: "🚪 Cerrar sesión", value: "logout" },
                        { name: "❌ Salir del sistema", value: "exit" },
                    ]
                    : [
                        { name: "🎟️ Comprar Entradas", value: "ventas" },
                        { name: "🍿 Comprar Comida", value: "comida" }, // 👈 cliente compra comida
                        { name: "🚪 Cerrar sesión", value: "logout" },
                        { name: "❌ Salir del sistema", value: "exit" },
                    ],
        });
        switch (opcion) {
            case "peliculas":
                await (0, menuPeliculas_1.mostrarMenuPeliculas)(servicios.peliculaService, servicios.peliculaFormatter);
                break;
            case "salas":
                await (0, menuSalas_1.mostrarMenuSalas)(servicios.salaService, servicios.salaFormatter);
                break;
            case "funciones":
                await (0, menuFunciones_1.mostrarMenuFunciones)(servicios.funcionService, servicios.peliculaService, servicios.salaService, servicios.funcionFormatter);
                break;
            case "ventas":
                await (0, menuVentas_1.mostrarMenuVentas)(servicios.ventaService, servicios.funcionService, servicios.usuarioService, servicios.ventaFormatter, servicios.usuario);
                break;
            case "comida":
                await (0, menuComida_1.mostrarMenuComida)(servicios.comidaService, servicios.comidaVentaService, servicios.comidaFormatter, servicios.usuario, servicios.usuarioService // 👈 añadido aquí
                );
                break;
            case "logout":
                return "logout";
            case "exit":
                return "exit";
        }
    }
}
