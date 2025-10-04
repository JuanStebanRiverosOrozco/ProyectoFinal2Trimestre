import { Usuario } from "../enditades/Usuario";

export interface IUsuarioRepository {
  guardar(usuario: Usuario): void;
  obtenerPorId(id: string): Usuario | undefined;
  obtenerPorCorreo(nombre:string, correo: string): Usuario | undefined;
  obtenerTodos(): Usuario[];
  eliminarPorId(id: string): boolean;
}
