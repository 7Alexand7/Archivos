import { Tarea } from '../models/tarea.model';

export class TaskService {
  private tareas: Tarea[] = [];

  agregar(tarea: Tarea) {
    this.tareas.push(tarea);
    return tarea;
  }

  obtenerTodas() {
    return this.tareas;
  }

  eliminar(id: number) {
    this.tareas = this.tareas.filter(t => t.id !== id);
  }
}
