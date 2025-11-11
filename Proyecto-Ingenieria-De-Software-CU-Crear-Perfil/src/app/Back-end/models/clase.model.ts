export interface Clase {
  id: string;
  nombre: string;
  descripcion: string;
  recursos?: string;
  cursoId: number;
  fechaCreacion: string;
  orden: number;
}

export interface ClaseData {
  nombre: string;
  descripcion: string;
  recursos?: string;
  cursoId: number;
}

export interface CursosClases {
  [cursoId: number]: Clase[];
}
