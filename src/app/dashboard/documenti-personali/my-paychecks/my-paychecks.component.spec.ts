import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPaychecksComponent } from './my-paychecks.component';

describe('MyPaychecksComponent', () => {
  let component: MyPaychecksComponent;
  let fixture: ComponentFixture<MyPaychecksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPaychecksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPaychecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
