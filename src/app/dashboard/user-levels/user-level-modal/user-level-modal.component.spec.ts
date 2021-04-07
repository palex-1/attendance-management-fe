import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLevelModalComponent } from './user-level-modal.component';

describe('UserLevelModalComponent', () => {
  let component: UserLevelModalComponent;
  let fixture: ComponentFixture<UserLevelModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLevelModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLevelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
