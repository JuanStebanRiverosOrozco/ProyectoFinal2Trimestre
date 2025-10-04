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
exports.mostrarMenuVentas = mostrarMenuVentas;
const prompts = __importStar(require("@inquirer/prompts"));
async function mostrarMenuVentas(ventaService, funcionService, usuarioService, ventaFormatter, usuario) {
    let salir = false;
    while (!salir) {
        console.clear();
        console.log("🎟️ Sistema de Ventas");
        const choices = usuario.getRol() === "admin"
            ? [
                { name: "📄 Listar TODAS las ventas", value: "listar_todas" },
                { name: "🔙 Volver", value: "salir" },
            ]
            : usuario.getRol() === "vendedor"
                ? [
                    { name: "➕ Realizar venta", value: "vender" },
                    { name: "📄 Listar TODAS las ventas", value: "listar_todas" },
                    { name: "🔙 Volver", value: "salir" },
                ]
                : [
                    { name: "➕ Comprar entradas", value: "vender" },
                    { name: "🧾 Ver mis compras", value: "mis_compras" },
                    { name: "🔙 Volver", value: "salir" },
                ];
        const opcion = await prompts.select({
            message: "Elige una opción:",
            choices,
        });
        switch (opcion) {
            case "vender": {
                const funciones = funcionService.listarFunciones();
                if (funciones.length === 0) {
                    console.log("⚠️ No hay funciones disponibles.");
                    break;
                }
                const funcionId = await prompts.select({
                    message: "📅 Selecciona una función:",
                    choices: funciones.map(f => ({
                        name: f.toString(),
                        value: f.getId(),
                    })),
                });
                const funcion = funcionService.buscarFuncionPorId(funcionId);
                console.log("\nPlano de asientos (IDs):");
                console.log(funcion.getMapaConIds());
                console.log("\nPlano visual (💺 disponible / ❌ ocupado):");
                console.log(funcion.getMapaVisual());
                const cantidadStr = await prompts.input({
                    message: "👥 Cantidad de entradas:",
                });
                const cantidad = Number(cantidadStr);
                if (isNaN(cantidad) || cantidad <= 0) {
                    console.log("❌ Cantidad inválida.");
                    break;
                }
                if (cantidad > funcion.getAsientosDisponibles()) {
                    console.log("❌ No hay suficientes asientos disponibles.");
                    break;
                }
                const selectedSeats = [];
                let availableSeats = funcion.listarAsientosDisponibles();
                for (let i = 0; i < cantidad; i++) {
                    const asiento = await prompts.select({
                        message: `Selecciona asiento ${i + 1}:`,
                        choices: availableSeats.map(a => ({ name: a, value: a })),
                    });
                    selectedSeats.push(asiento);
                    availableSeats = availableSeats.filter(s => s !== asiento);
                }
                try {
                    let comprador;
                    if (usuario.getRol() === "vendedor") {
                        // 👉 Vendedor busca un cliente ya existente
                        const nombre = await prompts.input({ message: "👤 Nombre del cliente (minúsculas,sin espacios y sin carácteres especiales):" });
                        const correo = await prompts.input({ message: "📧 Correo del cliente:" });
                        const encontrado = usuarioService.buscarPorCorreo(nombre, correo);
                        if (encontrado) {
                            console.log(`\n🔎 Cliente encontrado: ${encontrado.getNombre()} (${encontrado.getCorreo()}) — ID: ${encontrado.getId()}`);
                            comprador = encontrado;
                        }
                        else {
                            console.log(`⚠️ No existe un cliente con el correo ${correo}. La venta se registrará con los datos ingresados, pero sin asociar a un usuario.`);
                            // 👇 comprador se mantiene como datos temporales
                            comprador = { getNombre: () => nombre, getCorreo: () => correo, getId: () => "N/A" };
                        }
                    }
                    else {
                        // 👉 Cliente compra para sí mismo
                        comprador = usuario;
                    }
                    // Crear la venta asociada al comprador correcto
                    const venta = ventaService.realizarVenta(comprador, funcionId, selectedSeats, funcionService, comprador.getNombre(), comprador.getCorreo());
                    console.log("✅ Venta realizada:");
                    console.log(venta.toString());
                    console.log("\n--- FACTURA ---");
                    console.log(ventaFormatter.generarFactura(venta));
                }
                catch (err) {
                    console.error("❌ Error:", err.message);
                }
                break;
            }
            case "mis_compras": {
                const misVentas = ventaService.listarVentasPorUsuario(usuario.getId());
                if (misVentas.length === 0) {
                    console.log("No tienes compras registradas.");
                }
                else {
                    console.log("📋 Tus compras:");
                    console.log(ventaFormatter.listarComoTabla(misVentas));
                }
                break;
            }
            case "listar_todas": {
                const ventas = ventaService.listarVentas();
                if (ventas.length === 0) {
                    console.log("No hay ventas registradas.");
                }
                else {
                    console.log("📋 Todas las ventas:");
                    console.log(ventaFormatter.listarComoTabla(ventas));
                }
                break;
            }
            case "salir":
                salir = true;
                break;
        }
        if (!salir) {
            await prompts.input({ message: "Presiona ENTER para continuar..." });
        }
    }
}
