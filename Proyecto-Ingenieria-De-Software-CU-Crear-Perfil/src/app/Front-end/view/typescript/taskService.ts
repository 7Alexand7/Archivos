import { Injectable } from '@angular/core';
import { tarea } from './tarea.model';

const KEY = 'tareas_db_v1';

@Injectable({ providedIn: 'root' })
export class taskService {
  private read(): tarea[] {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as tarea[];
    return arr.map(
      t => new tarea(t.id, t.titulo, t.entrega, t.estado, t.descripcion, t.puntaje, t.curso)
    );
  }

  private write(arr: tarea[]) {
    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  getAll(): tarea[] {
    return this.read();
  }

  add(item: {
  titulo: string;
  entrega: string;
  estado: string;
  descripcion?: string;
  puntaje?: number | null;
  curso: string;
}): tarea {
  const arr = this.read();
  const newId = arr.length ? Math.max(...arr.map(t => t.id)) + 1 : 1;
  const nueva = new tarea(
    newId,
    item.titulo,
    item.entrega,
    item.estado,
    item.descripcion,
    item.puntaje,
    item.curso
  );
  arr.push(nueva);
  this.write(arr);
  return nueva;
}


  remove(id: number) {
    const arr = this.read().filter(t => t.id !== id);
    this.write(arr);
  }
}
