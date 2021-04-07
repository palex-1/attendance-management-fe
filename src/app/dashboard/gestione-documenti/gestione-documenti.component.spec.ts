import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneDocumentiComponent } from './gestione-documenti.component';

describe('GestioneDocumentiComponent', () => {
  let component: GestioneDocumentiComponent;
  let fixture: ComponentFixture<GestioneDocumentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestioneDocumentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestioneDocumentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
