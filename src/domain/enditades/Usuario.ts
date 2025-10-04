import { ValidationError } from "../errors/ValidationError";

export type Rol = "cliente" | "admin" | "vendedor";

export class Usuario {
  private readonly id: string;
  private nombre: string;
  private correo: string;
  private password: string; 
  private rol: Rol;

  constructor(id: string, nombre: string, correo: string, password: string, rol: Rol) {
    if (!nombre || nombre.trim() === "") {
      throw new ValidationError("El nombre es obligatorio.");
    }

    if (!correo || !correo.includes("@")) {
      throw new ValidationError("El correo electrónico no es válido.");
    }

    if (!["cliente", "admin","vendedor"].includes(rol)) {
      throw new ValidationError("El rol del usuario no es válido.");
    }

    if (password.length < 4) throw new ValidationError("La contraseña debe tener al menos 4 caracteres.");

    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
    this.password = password;
    this.rol = rol;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getNombre(): string {
    return this.nombre;
  }

  getCorreo(): string {
    return this.correo;
  }

  getRol(): Rol {
    return this.rol;
  }

  validarPassword(password: string): boolean {
    return this.password === password;
  }


  toString(): string {
    return `${this.nombre} (${this.rol}) - ${this.correo}`;
  }
}
