import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistPacientesComponent } from './hist-pacientes.component';

describe('HistPacientesComponent', () => {
  let component: HistPacientesComponent;
  let fixture: ComponentFixture<HistPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistPacientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
