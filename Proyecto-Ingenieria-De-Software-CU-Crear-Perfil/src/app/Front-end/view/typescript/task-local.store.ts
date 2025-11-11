import { Injectable } from '@angular/core';

export type Tarea = {
  id: number;
  titulo: string;
  entrega: string;          // 'YYYY-MM-DD'
  estado: string;           // 'Activa'
  descripcion?: string;
  puntaje?: number | null;  // 0..20
  curso: string;            // ← identifica el curso
};

const KEY = 'tareas_db_v1';

@Injectable({ providedIn: 'root' })
export class TaskLocalStore {
  private read(): Tarea[] {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Tarea[]) : [];
    } catch {
      return [];
    }
  }

  private write(arr: Tarea[]) {
    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  getAll(): Tarea[] {
    return this.read();
  }

  seedIfEmpty(semilla: Tarea[]) {
    const cur = this.read();
    if (!cur || cur.length === 0) this.write(semilla);
  }

  add(item: Omit<Tarea, 'id'>): Tarea {
    const arr = this.read();
    const newId = arr.length ? Math.max(...arr.map(t => t.id)) + 1 : 1;
    const tarea: Tarea = { id: newId, ...item };
    arr.push(tarea);
    this.write(arr);
    return tarea;
  }

  update(id: number, patch: Partial<Omit<Tarea, 'id'>>) {
    const arr = this.read();
    const i = arr.findIndex(t => t.id === id);
    if (i === -1) return false;
    arr[i] = { ...arr[i], ...patch, id };
    this.write(arr);
    return true;
  }

  remove(id: number) {
    const arr = this.read().filter(t => t.id !== id);
    this.write(arr);
  }
}
