import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCursos } from './gestion-cursos';

describe('GestionCursos', () => {
  let component: GestionCursos;
  let fixture: ComponentFixture<GestionCursos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCursos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionCursos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
