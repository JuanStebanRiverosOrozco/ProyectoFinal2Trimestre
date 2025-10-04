import { UsuarioRepositoryInMemory } from "../infra/inMemory/UsuarioRepositoryInMemory";
import { UsuarioService } from "../domain/services/UsuarioService";
import { mostrarMenuLogin } from "./menus/menuAuth";
import { mostrarMenuPrincipal } from "../app/menus/menuUser";

import { VentaService } from "../domain/services/VentaService";
import { FuncionService } from "../domain/services/FuncionService";
import { SalaService } from "../domain/services/SalaService";
import { PeliculaService } from "../domain/services/PeliculaService";

import { VentaRepositoryInMemory } from "../infra/inMemory/ventaRepositoryInMemory";
import { FuncionRepositoryInMemory } from "../infra/inMemory/FuncionRepocitoryInMemory";
import { SalaRepositoryInMemory } from "../infra/inMemory/SalaRepocitoryInMemory";
import { PeliculaRepositoryInMemory } from "../infra/inMemory/PeliculaRepositoryInMemory";

import { PeliculaFormatter } from "../Formatter/PeliculaFormatter";
import { SalaFormatter } from "../Formatter/SalaFormatter";
import { FuncionFormatter } from "../Formatter/FuncionFormatter";
import { VentaFormatter } from "../Formatter/VentaFormatter";

import { ComidaService } from "../domain/services/ComidaService";
import { ComidaVentaService } from "../domain/services/ComidaVentaService";
import { ComidaFormatter } from "../Formatter/ComidaFormatter";


async function main() {
  const usuarioRepo = new UsuarioRepositoryInMemory();
  const usuarioService = new UsuarioService(usuarioRepo);

  const ventaService = new VentaService(new VentaRepositoryInMemory());
  const funcionService = new FuncionService(new FuncionRepositoryInMemory());
  const salaService = new SalaService(new SalaRepositoryInMemory());
  const peliculaService = new PeliculaService(new PeliculaRepositoryInMemory());

  const peliculaFormatter = new PeliculaFormatter();
  const salaFormatter = new SalaFormatter();
  const funcionFormatter = new FuncionFormatter();
  const ventaFormatter = new VentaFormatter();

  const comidaService = new ComidaService();
  const comidaVentaService = new ComidaVentaService();
  const comidaFormatter = new ComidaFormatter();

  while (true) {
    let usuario = null;

    // 🔐 Login o registro hasta que sea válido
    while (!usuario) {
      usuario = await mostrarMenuLogin(usuarioService, {
        ventaService,
        usuarioRepo,
        peliculaService,
        funcionService,
        salaService,
        comidaService
      });
    }

    // ⚙️ Menú principal según rol
    const resultado = await mostrarMenuPrincipal(usuario, {
      ventaService,
      funcionService,
      salaService,
      peliculaService,
      usuarioService,
      peliculaFormatter,
      salaFormatter,
      funcionFormatter,
      ventaFormatter,
      comidaService,        // 👈 añadidos
      comidaVentaService,   // 👈 añadidos
      comidaFormatter,      // 👈 añadidos
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

