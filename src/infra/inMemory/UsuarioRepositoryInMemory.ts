import { Usuario } from "../../domain/enditades/Usuario";
import { IUsuarioRepository } from "../../domain/interFaces/IUsuarioRepository";

export class UsuarioRepositoryInMemory implements IUsuarioRepository {
  private usuarios: Usuario[] = [];

  guardar(usuario: Usuario): void {
    this.usuarios.push(usuario);
  }

  obtenerPorId(id: string): Usuario | undefined {
    return this.usuarios.find(u => u.getId() === id);
  }

  obtenerPorCorreo(nombre:string, correo: string): Usuario | undefined {
    return this.usuarios.find(u => u.getNombre()=== nombre && u.getCorreo() === correo);
  }

  obtenerTodos(): Usuario[] {
    return [...this.usuarios];
  }

  eliminarPorId(id: string): boolean {
    const index = this.usuarios.findIndex(u => u.getId() === id);
    if (index !== -1) {
      this.usuarios.splice(index, 1);
      return true;
    }
    return false;
  }
}
