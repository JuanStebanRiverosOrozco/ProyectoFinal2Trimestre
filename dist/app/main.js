"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UsuarioRepositoryInMemory_1 = require("../infra/inMemory/UsuarioRepositoryInMemory");
const UsuarioService_1 = require("../domain/services/UsuarioService");
const menuAuth_1 = require("./menus/menuAuth");
const menuUser_1 = require("../app/menus/menuUser");
const VentaService_1 = require("../domain/services/VentaService");
const FuncionService_1 = require("../domain/services/FuncionService");
const SalaService_1 = require("../domain/services/SalaService");
const PeliculaService_1 = require("../domain/services/PeliculaService");
const ventaRepositoryInMemory_1 = require("../infra/inMemory/ventaRepositoryInMemory");
const FuncionRepocitoryInMemory_1 = require("../infra/inMemory/FuncionRepocitoryInMemory");
const SalaRepocitoryInMemory_1 = require("../infra/inMemory/SalaRepocitoryInMemory");
const PeliculaRepositoryInMemory_1 = require("../infra/inMemory/PeliculaRepositoryInMemory");
const PeliculaFormatter_1 = require("../Formatter/PeliculaFormatter");
const SalaFormatter_1 = require("../Formatter/SalaFormatter");
const FuncionFormatter_1 = require("../Formatter/FuncionFormatter");
const VentaFormatter_1 = require("../Formatter/VentaFormatter");
const ComidaService_1 = require("../domain/services/ComidaService");
const ComidaVentaService_1 = require("../domain/services/ComidaVentaService");
const ComidaFormatter_1 = require("../Formatter/ComidaFormatter");
async function main() {
    const usuarioRepo = new UsuarioRepositoryInMemory_1.UsuarioRepositoryInMemory();
    const usuarioService = new UsuarioService_1.UsuarioService(usuarioRepo);
    const ventaService = new VentaService_1.VentaService(new ventaRepositoryInMemory_1.VentaRepositoryInMemory());
    const funcionService = new FuncionService_1.FuncionService(new FuncionRepocitoryInMemory_1.FuncionRepositoryInMemory());
    const salaService = new SalaService_1.SalaService(new SalaRepocitoryInMemory_1.SalaRepositoryInMemory());
    const peliculaService = new PeliculaService_1.PeliculaService(new PeliculaRepositoryInMemory_1.PeliculaRepositoryInMemory());
    const peliculaFormatter = new PeliculaFormatter_1.PeliculaFormatter();
    const salaFormatter = new SalaFormatter_1.SalaFormatter();
    const funcionFormatter = new FuncionFormatter_1.FuncionFormatter();
    const ventaFormatter = new VentaFormatter_1.VentaFormatter();
    const comidaService = new ComidaService_1.ComidaService();
    const comidaVentaService = new ComidaVentaService_1.ComidaVentaService();
    const comidaFormatter = new ComidaFormatter_1.ComidaFormatter();
    while (true) {
        let usuario = null;
        // 🔐 Login o registro hasta que sea válido
        while (!usuario) {
            usuario = await (0, menuAuth_1.mostrarMenuLogin)(usuarioService, {
                ventaService,
                usuarioRepo,
                peliculaService,
                funcionService,
                salaService,
                comidaService
            });
        }
        // ⚙️ Menú principal según rol
        const resultado = await (0, menuUser_1.mostrarMenuPrincipal)(usuario, {
            ventaService,
            funcionService,
            salaService,
            peliculaService,
            usuarioService,
            peliculaFormatter,
            salaFormatter,
            funcionFormatter,
            ventaFormatter,
            comidaService, // 👈 añadidos
            comidaVentaService, // 👈 añadidos
            comidaFormatter, // 👈 añadidos
            usuario,
        });
        if (resultado === "logout") {
            console.log("\n👋 Sesión cerrada, volviendo al login...\n");
            continue; // vuelve a login
        }
        if (resultado === "exit") {
            console.log("\n✅ Programa finalizado. ¡Hasta luego!\n");
            break; // sale del programa
        }
    }
}
main();
