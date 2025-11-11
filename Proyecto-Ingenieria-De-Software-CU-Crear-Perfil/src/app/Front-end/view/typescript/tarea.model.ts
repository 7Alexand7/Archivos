export class tarea {
  constructor(
    public id: number,
    public titulo: string,
    public entrega: string,
    public estado: string,
    public descripcion: string = '',
    public puntaje: number | null = null,
    public curso: string = ''
  ) {}

  get fechaCorta(): string {
    if (!this.entrega) return '-';
    const [y, m, d] = this.entrega.split('-').map(Number);
    const dd = String(d).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    const yy = String(y).slice(-2);
    return `${dd}/${mm}/${yy}`;
  }

  get estaCerrada(): boolean {
    return new Date(this.entrega) < new Date();
  }
}
