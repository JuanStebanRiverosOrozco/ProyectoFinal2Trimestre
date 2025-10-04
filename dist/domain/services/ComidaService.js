"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComidaService = void 0;
// src/domain/services/ComidaService.ts
const Comida_1 = require("../enditades/Comida");
const ValidationError_1 = require("../errors/ValidationError");
const IdGenerator_1 = require("./IdGenerator");
class ComidaService {
    constructor() {
        this.comidas = [];
    }
    crearProducto(nombre, precio) {
        const id = IdGenerator_1.IdGenerator.next("Comida");
        const comida = new Comida_1.Comida(id, nombre, precio);
        this.comidas.push(comida);
        return comida;
    }
    crearCombo(nombre, productosIds, tipoCombo) {
        if (productosIds.length === 0 || productosIds.length === 1) {
            throw new ValidationError_1.ValidationError("Un combo debe incluir al menos dos producto.");
        }
        const productos = this.comidas.filter((c) => productosIds.includes(c.getId()));
        if (productos.length !== productosIds.length) {
            throw new ValidationError_1.ValidationError("Algunos productos no existen.");
        }
        // Normalizar nombre: quita acentos, espacios, guiones, underscores y normaliza números
        const normalizar = (s) => s
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // quitar tildes
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "") // quitar todo lo que no sea letra/dígito
            .replace(/(\d+)/g, (m) => String(Number(m))); // normalizar números
        const nombreNormalizado = normalizar(nombre);
        // 🔹 Buscar colisión por nombre + tipoCombo
        const existe = this.comidas.some((c) => {
            if (!c.esCombo())
                return false;
            const mismoTipo = c.getTipoCombo() === tipoCombo;
            const nombreSimilar = normalizar(c.getNombre()) === nombreNormalizado;
            return mismoTipo && nombreSimilar;
        });
        if (existe) {
            throw new ValidationError_1.ValidationError(`Ya existe un combo con nombre similar ("${nombre}") y tipo "${tipoCombo}".`);
        }
        const id = IdGenerator_1.IdGenerator.next("Comida");
        const combo = new Comida_1.Comida(id, nombre, 0, productos, tipoCombo);
        this.comidas.push(combo);
        return combo;
    }
    listarProductos() {
        return this.comidas.filter((c) => !c.esCombo());
    }
    listarCombos() {
        return this.comidas.filter((c) => c.esCombo());
    }
    listarTodos() {
        return this.comidas;
    }
    buscarPorId(id) {
        return this.comidas.find((c) => c.getId() === id);
    }
}
exports.ComidaService = ComidaService;
