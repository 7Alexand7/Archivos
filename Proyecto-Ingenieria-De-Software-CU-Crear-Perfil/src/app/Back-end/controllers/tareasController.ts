import { TaskService } from '../services/taskService';
import { Tarea } from '../models/tarea.model';

export class TareasController {
  private servicio = new TaskService();

  crearTarea(datos: any) {
    const nueva = new Tarea(Date.now(), datos.titulo, datos.entrega, 'Activa', datos.descripcion);
    return this.servicio.agregar(nueva);
  }

  listarTareas() {
    return this.servicio.obtenerTodas();
  }

  eliminarTarea(id: number) {
    this.servicio.eliminar(id);
    return { mensaje: 'Tarea eliminada' };
  }
}
