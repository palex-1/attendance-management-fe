import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCommessaComponent } from './info-commessa.component';

describe('InfoCommessaComponent', () => {
  let component: InfoCommessaComponent;
  let fixture: ComponentFixture<InfoCommessaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoCommessaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoCommessaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
