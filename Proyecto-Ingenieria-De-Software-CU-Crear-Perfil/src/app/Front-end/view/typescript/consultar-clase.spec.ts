import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarClase } from './consultar-clase';

describe('ConsultarClase', () => {
  let component: ConsultarClase;
  let fixture: ComponentFixture<ConsultarClase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarClase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarClase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
