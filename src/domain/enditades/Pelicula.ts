import { ValidationError } from "../errors/ValidationError";

export type Clasificacion = "G" | "PG" | "PG-13" | "R" | "NC-17";
export type Idioma = "Español" | "Inglés" | "Subtitulada" | "Doblada";
export type Genero = "Acción" | "Comedia" | "Drama" | "Terror" | "Animación";

export class Pelicula {
  private readonly id: string;
  private titulo: string;
  private duracion: number; // minutos
  private clasificacion: Clasificacion;
  private idioma: Idioma;
  private genero: Genero;
  private disponible: boolean;

  constructor(
    id: string,
    titulo: string,
    duracion: number,
    clasificacion: Clasificacion,
    idioma: Idioma,
    genero: Genero,
    disponible: boolean = true
  ) {
    if (!titulo || titulo.trim() === "") {
      throw new ValidationError("El título es obligatorio.");
    }
    if (duracion <= 0) {
      throw new ValidationError("La duración debe ser mayor a 0.");
    }

    this.id = id;
    this.titulo = titulo;
    this.duracion = duracion;
    this.clasificacion = clasificacion;
    this.idioma = idioma;
    this.genero = genero;
    this.disponible = disponible;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getTitulo(): string {
    return this.titulo;
  }

  getDuracion(): number {
    return this.duracion;
  }

  getClasificacion(): Clasificacion {
    return this.clasificacion;
  }

  getIdioma(): Idioma {
    return this.idioma;
  }

  getGenero(): Genero {
    return this.genero;
  }

  isDisponible(): boolean {
    return this.disponible;
  }

  // Setter controlado
  setDisponible(disponible: boolean): void {
    this.disponible = disponible;
  }

  toString(): string {
    return `${this.titulo} (${this.genero}, ${this.duracion} min, ${this.clasificacion})`;
  }
}
