import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputUploadComponent } from './file-input-upload.component';

describe('FileInputUploadComponent', () => {
  let component: FileInputUploadComponent;
  let fixture: ComponentFixture<FileInputUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileInputUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInputUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
