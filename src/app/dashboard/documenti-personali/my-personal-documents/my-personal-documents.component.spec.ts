import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPersonalDocumentsComponent } from './my-personal-documents.component';

describe('MyPersonalDocumentsComponent', () => {
  let component: MyPersonalDocumentsComponent;
  let fixture: ComponentFixture<MyPersonalDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPersonalDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPersonalDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
