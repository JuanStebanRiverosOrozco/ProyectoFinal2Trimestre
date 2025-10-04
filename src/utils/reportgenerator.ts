// src/app/utils/reportGenerator.ts
import { Comida } from "../../src/domain/enditades/Comida";
import { Funcion } from "../../src/domain/enditades/Funcion";
import { Pelicula } from "../../src/domain/enditades/Pelicula";
import { Sala } from "../../src/domain/enditades/Sala";
import { Usuario } from "../../src/domain/enditades/Usuario";
import { Venta } from "../../src/domain/enditades/Venta";

import * as fs from "fs";
import * as path from "path";

export class ReportGenerator {
  // Reportes individuales
  static generarReporteVentasJSON(ventas: Venta[]): void {
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

  static generarReportePeliculasJSON(peliculas: Pelicula[]): void {
    const reporte = peliculas.map(p => ({
      id: p.getId(),
      titulo: p.getTitulo(),
      duracion: p.getDuracion(),
      genero: p.getGenero(),
      clasificacion: p.getClasificacion()
    }));
    this.guardarArchivo("reporte_peliculas.json", reporte);
  }

  static generarReporteSalasJSON(salas: Sala[]): void {
    const reporte = salas.map(s => ({
      id: s.getId(),
      nombre: s.getNombre(),
      tipo: s.getTipo(),
      capacidad: s.getCapacidad()
    }));
    this.guardarArchivo("reporte_salas.json", reporte);
  }

  static generarReporteFuncionesJSON(funciones: Funcion[]): void {
    const reporte = funciones.map(f => ({
      id: f.getId(),
      pelicula: f.getPelicula().getTitulo(),
      sala: f.getSala().getNombre(),
      fecha: f.getFecha().toISOString(),
      precioEntrada: f.getPrecio()
    }));
    this.guardarArchivo("reporte_funciones.json", reporte);
  }

  static generarReporteUsuariosJSON(usuarios: Usuario[]): void {
    const reporte = usuarios.map(u => ({
      id: u.getId(),
      nombre: u.getNombre(),
      correo: u.getCorreo(),
      rol: u.getRol()
    }));
    this.guardarArchivo("reporte_usuarios.json", reporte);
  }

  static generarReporteComidasJSON(comidas: Comida[]): void {
    const reporte = comidas.map(c => ({
      id: c.getId(),
      nombre: c.getNombre(),
      precio: c.getPrecio(),
      esCombo: c.esCombo()
    }));
    this.guardarArchivo("reporte_comidas.json", reporte);
  }

  // 📌 Reporte combinado en un único archivo
  static generarReporteCompletoJSON(
    ventas: Venta[],
    usuarios: Usuario[],
    peliculas: Pelicula[],
    funciones: Funcion[],
    salas: Sala[],
    comidas: Comida[]
  ): void {
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
  private static guardarArchivo(nombreArchivo: string, data: any): void {
    const ruta = path.join(__dirname, "../../src/output/", nombreArchivo);

    try {
      fs.writeFileSync(ruta, JSON.stringify(data, null, 2), "utf-8");
      console.log(`\n✅ Reporte generado correctamente en: ${ruta}`);
    } catch (error: any) {
      console.error("❌ Error al generar el reporte:", error.message);
    }
  }
}