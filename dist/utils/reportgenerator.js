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
exports.ReportGenerator = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ReportGenerator {
    // Reportes individuales
    static generarReporteVentasJSON(ventas) {
        const reporte = ventas.map(v => ({
            id: v.getId(),
            fecha: v.getFuncion().getFecha().toISOString(),
            pelicula: v.getFuncion().getPelicula().getTitulo(),
            sala: v.getFuncion().getSala().getNombre(),
            cantidad: v.getCantidad(),
            asientos: v.getAsientosIds(),
            cliente: {
                nombre: v.getNombre(),
                correo: v.getCorreo()
            },
            precioUnitario: v.getPrecio(),
            subtotal: v.getTotal(),
            iva: v.getTotal() * 0.19,
            total: v.getTotal() * 1.19
        }));
        this.guardarArchivo("reporte_ventas.json", reporte);
    }
    static generarReportePeliculasJSON(peliculas) {
        const reporte = peliculas.map(p => ({
            id: p.getId(),
            titulo: p.getTitulo(),
            duracion: p.getDuracion(),
            genero: p.getGenero(),
            clasificacion: p.getClasificacion()
        }));
        this.guardarArchivo("reporte_peliculas.json", reporte);
    }
    static generarReporteSalasJSON(salas) {
        const reporte = salas.map(s => ({
            id: s.getId(),
            nombre: s.getNombre(),
            tipo: s.getTipo(),
            capacidad: s.getCapacidad()
        }));
        this.guardarArchivo("reporte_salas.json", reporte);
    }
    static generarReporteFuncionesJSON(funciones) {
        const reporte = funciones.map(f => ({
            id: f.getId(),
            pelicula: f.getPelicula().getTitulo(),
            sala: f.getSala().getNombre(),
            fecha: f.getFecha().toISOString(),
            precioEntrada: f.getPrecio()
        }));
        this.guardarArchivo("reporte_funciones.json", reporte);
    }
    static generarReporteUsuariosJSON(usuarios) {
        const reporte = usuarios.map(u => ({
            id: u.getId(),
            nombre: u.getNombre(),
            correo: u.getCorreo(),
            rol: u.getRol()
        }));
        this.guardarArchivo("reporte_usuarios.json", reporte);
    }
    static generarReporteComidasJSON(comidas) {
        const reporte = comidas.map(c => ({
            id: c.getId(),
            nombre: c.getNombre(),
            precio: c.getPrecio(),
            esCombo: c.esCombo()
        }));
        this.guardarArchivo("reporte_comidas.json", reporte);
    }
    // 📌 Reporte combinado en un único archivo
    static generarReporteCompletoJSON(ventas, usuarios, peliculas, funciones, salas, comidas) {
        const reporte = {
            ventas: ventas.map(v => ({
                id: v.getId(),
                fecha: v.getFuncion().getFecha().toISOString(),
                pelicula: v.getFuncion().getPelicula().getTitulo(),
                sala: v.getFuncion().getSala().getNombre(),
                cantidad: v.getCantidad(),
                asientos: v.getAsientosIds(),
                cliente: {
                    nombre: v.getNombre(),
                    correo: v.getCorreo()
                },
                precioUnitario: v.getPrecio(),
                subtotal: v.getTotal(),
                iva: v.getTotal() * 0.19,
                total: v.getTotal() * 1.19
            })),
            usuarios: usuarios.map(u => ({
                id: u.getId(),
                nombre: u.getNombre(),
                correo: u.getCorreo(),
                rol: u.getRol()
            })),
            peliculas: peliculas.map(p => ({
                id: p.getId(),
                titulo: p.getTitulo(),
                duracion: p.getDuracion(),
                genero: p.getGenero(),
                clasificacion: p.getClasificacion()
            })),
            funciones: funciones.map(f => ({
                id: f.getId(),
                pelicula: f.getPelicula().getTitulo(),
                sala: f.getSala().getNombre(),
                fecha: f.getFecha().toISOString(),
                precioEntrada: f.getPrecio()
            })),
            salas: salas.map(s => ({
                id: s.getId(),
                nombre: s.getNombre(),
                tipo: s.getTipo(),
                capacidad: s.getCapacidad()
            })),
            comidas: comidas.map(c => ({
                id: c.getId(),
                nombre: c.getNombre(),
                precio: c.getPrecio(),
                esCombo: c.esCombo()
            }))
        };
        this.guardarArchivo("reporte_completo.json", reporte);
    }
    // 🔒 método reutilizado
    static guardarArchivo(nombreArchivo, data) {
        const ruta = path.join(__dirname, "../../src/output/", nombreArchivo);
        try {
            fs.writeFileSync(ruta, JSON.stringify(data, null, 2), "utf-8");
            console.log(`\n✅ Reporte generado correctamente en: ${ruta}`);
        }
        catch (error) {
            console.error("❌ Error al generar el reporte:", error.message);
        }
    }
}
exports.ReportGenerator = ReportGenerator;
