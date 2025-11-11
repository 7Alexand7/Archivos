export class Tarea {
  constructor(
    public id: number,
    public titulo: string,
    public entrega: string,
    public estado: string,
    public descripcion?: string,
    public puntaje?: number,
    public curso?: string
  ) {}
}
