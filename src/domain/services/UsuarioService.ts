import { Usuario, Rol } from "../enditades/Usuario";
import { IUsuarioRepository } from "../interFaces/IUsuarioRepository";
import { ValidationError } from "../errors/ValidationError";
import { IdGenerator } from "./IdGenerator";

export class UsuarioService {
  constructor(private readonly repo: IUsuarioRepository) {}

  registrar(nombre: string, correo: string, password: string, rol: Rol): Usuario {
    if (this.repo.obtenerPorCorreo(nombre,correo)) {
      throw new ValidationError("Ya existe un usuario con este correo.");
    }

    const id = IdGenerator.next("Usuario");
    const nuevo = new Usuario(id, nombre, correo, password, rol);
    this.repo.guardar(nuevo);
    return nuevo;
  }

  login(nombre:string, correo: string, password: string): Usuario {
    const usuario = this.repo.obtenerPorCorreo(nombre,correo);
    if (!usuario || !usuario.validarPassword(password)) {
      throw new ValidationError("Nombre,correo o contraseña incorrectos.");
    }
    return usuario;
  }

  /**
   * Busca un cliente por correo y nombre. 
   * Si no existe, lo crea automáticamente como cliente.
   */
  buscarPorCorreo(nombre:string, correo: string): Usuario | null {
    const usuario = this.repo.obtenerPorCorreo(nombre,correo);
    return usuario ?? null;
  }

}
