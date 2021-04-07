import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncarichiGiornalieriComponent } from './incarichi-giornalieri.component';

describe('IncarichiGiornalieriComponent', () => {
  let component: IncarichiGiornalieriComponent;
  let fixture: ComponentFixture<IncarichiGiornalieriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncarichiGiornalieriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncarichiGiornalieriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
