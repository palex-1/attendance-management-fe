import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingAddEditModalComponent } from './setting-add-edit-modal.component';

describe('SettingAddEditModalComponent', () => {
  let component: SettingAddEditModalComponent;
  let fixture: ComponentFixture<SettingAddEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingAddEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingAddEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
