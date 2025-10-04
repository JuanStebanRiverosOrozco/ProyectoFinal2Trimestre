// src/app/menus/menuPrincipal.ts
import * as prompts from "@inquirer/prompts";
import { Usuario } from "../../domain/enditades/Usuario";
import { UsuarioService } from "../../domain/services/UsuarioService";  // 👈 importar

import { mostrarMenuVentas } from "./menuVentas";
import { mostrarMenuSalas } from "./menuSalas";
import { mostrarMenuPeliculas } from "./menuPeliculas";
import { mostrarMenuFunciones } from "./menuFunciones";
import { mostrarMenuComida } from "./menuComida";  // 👈 ya está

import { VentaService } from "../../domain/services/VentaService";
import { FuncionService } from "../../domain/services/FuncionService";
import { SalaService } from "../../domain/services/SalaService";
import { PeliculaService } from "../../domain/services/PeliculaService";

import { PeliculaFormatter } from "../../Formatter/PeliculaFormatter";
import { SalaFormatter } from "../../Formatter/SalaFormatter";
import { FuncionFormatter } from "../../Formatter/FuncionFormatter";
import { VentaFormatter } from "../../Formatter/VentaFormatter";

import { ComidaService } from "../../domain/services/ComidaService";
import { ComidaVentaService } from "../../domain/services/ComidaVentaService";
import { ComidaFormatter } from "../../Formatter/ComidaFormatter";

type Servicios = {
  ventaService: VentaService;
  funcionService: FuncionService;
  salaService: SalaService;
  peliculaService: PeliculaService;
  usuarioService: UsuarioService;     
  peliculaFormatter: PeliculaFormatter;
  salaFormatter: SalaFormatter;
  funcionFormatter: FuncionFormatter;
  ventaFormatter: VentaFormatter;
  comidaService: ComidaService;            
  comidaVentaService: ComidaVentaService;  
  comidaFormatter: ComidaFormatter;
  usuario: Usuario;
};

/**
 * Devuelve "logout" si el usuario cierra sesión (vuelve al login)
 * Devuelve "exit" si el usuario quiere terminar el programa
 */
export async function mostrarMenuPrincipal(
  usuario: Usuario,
  servicios: Servicios
): Promise<"logout" | "exit"> {
  while (true) {
    const opcion = await prompts.select({
      message: `👤 ${usuario.getNombre()} (${usuario.getRol()}) - Menú`,
      choices:
        usuario.getRol() === "admin"
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
        await mostrarMenuPeliculas(servicios.peliculaService, servicios.peliculaFormatter);
        break;

      case "salas":
        await mostrarMenuSalas(servicios.salaService, servicios.salaFormatter);
        break;

      case "funciones":
        await mostrarMenuFunciones(
          servicios.funcionService,
          servicios.peliculaService,
          servicios.salaService,
          servicios.funcionFormatter,
        );
        break;

      case "ventas":
        await mostrarMenuVentas(
          servicios.ventaService,
          servicios.funcionService,
          servicios.usuarioService,
          servicios.ventaFormatter,
          servicios.usuario
        );
        break;

      case "comida":
        await mostrarMenuComida(
          servicios.comidaService,
          servicios.comidaVentaService,
          servicios.comidaFormatter,
          servicios.usuario,
          servicios.usuarioService   // 👈 añadido aquí
        );
        break;

      case "logout":
        return "logout";

      case "exit":
        return "exit";
    }
  }
}
