// src/app/menus/menuLogin.ts
import * as prompts from "@inquirer/prompts";
import { UsuarioService } from "../../domain/services/UsuarioService";
import { Usuario, Rol } from "../../domain/enditades/Usuario";
import { ReportGenerator } from "../../utils/reportgenerator";

export async function mostrarMenuLogin(
  usuarioService: UsuarioService,
  deps: {
    ventaService: any;
    usuarioRepo: any;
    peliculaService: any;
    funcionService: any;
    salaService: any;
    comidaService: any;
  }
): Promise<Usuario | null> {
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
    }) as Rol;

    try {
      const usuario = usuarioService.registrar(nombre, correo, password, rol);
      console.log(`✅ Usuario ${usuario.getNombre()} registrado (${usuario.getRol()})`);
      return null;
    } catch (err: any) {
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
    } catch (err: any) {
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

      ReportGenerator.generarReporteVentasJSON(ventas);
      ReportGenerator.generarReporteUsuariosJSON(usuarios);
      ReportGenerator.generarReportePeliculasJSON(peliculas);
      ReportGenerator.generarReporteFuncionesJSON(funciones);
      ReportGenerator.generarReporteSalasJSON(salas);
      ReportGenerator.generarReporteComidasJSON(comidas);

      ReportGenerator.generarReporteCompletoJSON(
        ventas, usuarios, peliculas, funciones, salas, comidas
      );
    } catch (err: any) {
      console.error("❌ Error generando reportes:", err?.message ?? String(err));
    }
    console.log("\n✅ Programa finalizado. ¡Hasta luego!\n");
    process.exit(0);
  }

  return null;
}
