import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamCommessaComponent } from './team-commessa.component';

describe('TeamCommessaComponent', () => {
  let component: TeamCommessaComponent;
  let fixture: ComponentFixture<TeamCommessaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamCommessaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamCommessaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
