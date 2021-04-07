import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingAreaConfigsComponent } from './setting-area-configs.component';

describe('SettingAreaConfigsComponent', () => {
  let component: SettingAreaConfigsComponent;
  let fixture: ComponentFixture<SettingAreaConfigsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingAreaConfigsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingAreaConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
