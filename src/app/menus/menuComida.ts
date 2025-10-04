// src/app/menus/menuComida.ts
import * as prompts from "@inquirer/prompts";
import { Usuario } from "../../domain/enditades/Usuario";
import { ComidaService } from "../../domain/services/ComidaService";
import { ComidaVentaService } from "../../domain/services/ComidaVentaService";
import { ComidaFormatter } from "../../Formatter/ComidaFormatter";
import { UsuarioService } from "../../domain/services/UsuarioService";
import { ValidationError } from "../../domain/errors/ValidationError";
import { TipoCombo } from "../../domain/enditades/Comida"; // <-- IMPORTAR el tipo

export async function mostrarMenuComida(
  comidaService: ComidaService,
  comidaVentaService: ComidaVentaService,
  comidaFormatter: ComidaFormatter,
  usuario: Usuario,
  usuarioService: UsuarioService
): Promise<void> {
  let salir = false;

  while (!salir) {
    console.clear();
    console.log("🍿 Sistema de Comida");

    const choices =
      usuario.getRol() === "admin"
        ? [
          { name: "➕ Registrar producto", value: "registrar_producto" },
          { name: "➕ Registrar combo", value: "registrar_combo" },
          { name: "📄 Listar productos y combos", value: "listar" },
          { name: "📄 Listar TODAS las ventas de comida", value: "listar_todas" },
          { name: "🔙 Volver", value: "salir" },
        ]
        : usuario.getRol() === "vendedor"
          ? [
            { name: "➕ Vender comida", value: "comprar" },
            { name: "📄 Listar TODAS las ventas de comida", value: "listar_todas" },
            { name: "🔙 Volver", value: "salir" },
          ]
          : [
            { name: "➕ Comprar comida", value: "comprar" },
            { name: "🧾 Ver mis compras de comida", value: "mis_compras" },
            { name: "🔙 Volver", value: "salir" },
          ];

    const opcion = await prompts.select({ message: "Elige una opción:", choices });

    try {
      switch (opcion) {
        case "registrar_producto": {
          const nombre = await prompts.input({ message: "Nombre del producto:" });
          const precioStr = await prompts.input({ message: "Precio del producto:" });
          const precio = Number(precioStr);

          if (!nombre || nombre.trim() === "") throw new ValidationError("El nombre del producto no puede estar vacío.");
          if (isNaN(precio) || precio <= 0) throw new ValidationError("El precio debe ser un número válido mayor que 0.");

          comidaService.crearProducto(nombre, precio);
          console.log(`✅ Producto "${nombre}" registrado con precio $${(precio).toLocaleString()}`);
          break;
        }

        case "registrar_combo": {
          const productos = comidaService.listarProductos();
          if (productos.length === 0) throw new ValidationError("No hay productos disponibles para crear un combo.");

          const nombre = await prompts.input({ message: "Nombre del combo:" });
          if (!nombre || nombre.trim() === "") throw new ValidationError("El nombre del combo no puede estar vacío.");

          // -> casteamos el resultado como TipoCombo para que TypeScript sea feliz
          const tipoCombo = (await prompts.select({
            message: "Selecciona el tipo de combo:",
            choices: [
              { name: "Económico (10% descuento)", value: "economico" },
              { name: "Familiar (20% descuento)", value: "familiar" },
              { name: "Premium (30% descuento)", value: "premium" },
            ],
          })) as TipoCombo;

          const seleccionados = await prompts.checkbox({
            message: "Selecciona productos para el combo:",
            choices: productos.map((p) => ({ name: `${p.getNombre()} ($${p.getPrecio().toLocaleString()})`, value: p.getId() })),
          });

          if (!seleccionados || seleccionados.length === 0) throw new ValidationError("Debes seleccionar al menos un producto para crear el combo.");

          // <-- Aquí ya no debe fallar: tipoCombo es del tipo correcto
          const combo = comidaService.crearCombo(nombre, seleccionados, tipoCombo);

          console.log(`✅ Combo "${combo.getNombre()}" creado con ${combo.getProductos().length} productos — Precio final: $${combo.getPrecio().toLocaleString()}`);
          break;
        }

        case "listar": {
          const productos = comidaService.listarProductos();
          if (productos.length === 0) {
            console.log("\n⚠️ No hay productos y combos registradas.\n");
          } else {
            console.log("📋 Productos y Combos disponibles:");
            console.log(comidaFormatter.listarProductosYCombos(comidaService.listarTodos()));
          }
          break;
        }

        case "comprar": {
          const disponibles = comidaService.listarTodos();
          if (disponibles.length === 0) throw new ValidationError("No hay productos ni combos disponibles para comprar.");

          const seleccionados = await prompts.checkbox({
            message: "Selecciona productos o combos:",
            choices: disponibles.map((p) => {
              if (p.esCombo()) {
                const items = p.getProductos().map((i) => i.getNombre()).join(", ");
                return { name: `${p.getNombre()} ($${p.getPrecio().toLocaleString()}) [${items}]`, value: p.getId() };
              }
              return { name: `${p.getNombre()} ($${p.getPrecio().toLocaleString()})`, value: p.getId() };
            }),
          });

          if (!seleccionados || seleccionados.length === 0) throw new ValidationError("Debes seleccionar al menos un producto o combo para la compra.");

          let comprador: Usuario | { getNombre: () => string; getCorreo: () => string };

          if (usuario.getRol() === "vendedor") {
            const nombreCliente = await prompts.input({ message: "👤 Nombre del cliente  (minúsculas,sin espacios y sin carácteres especiales):" });
            const correo = await prompts.input({ message: "📧 Correo del cliente:" });
            const encontrado = usuarioService.buscarPorCorreo(nombreCliente,correo);
            comprador = encontrado ?? { getNombre: () => nombreCliente, getCorreo: () => correo, getId: () => "N/A" };
          } else {
            comprador = usuario;
          }

          const venta = comidaVentaService.realizarVenta(comprador, seleccionados, comidaService);

          console.log("✅ Venta realizada:");
          console.log("\n--- FACTURA ---");
          console.log(comidaFormatter.generarFactura(venta));
          break;
        }

        case "mis_compras": {
          const misCompras = comidaVentaService.listarVentasPorUsuario(usuario.getId());
          if (misCompras.length === 0) console.log("No tienes compras de comida registradas.");
          else console.log(comidaFormatter.listarComoTabla(misCompras));
          break;
        }

        case "listar_todas": {
          const ventas = comidaVentaService.listarVentas();
          if (ventas.length === 0) console.log("No hay ventas registradas.");
          else console.log(comidaFormatter.listarComoTabla(ventas));
          break;
        }

        case "salir":
          salir = true;
          break;
      }
    } catch (err: any) {
      console.error("❌ Error:", err?.message ?? String(err));
    }

    if (!salir) await prompts.input({ message: "Presiona ENTER para continuar..." });
  }
}
