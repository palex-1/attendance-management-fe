import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagebleFilterInputComponent } from './pageble-filter-input.component';

describe('PagebleFilterInputComponent', () => {
  let component: PagebleFilterInputComponent;
  let fixture: ComponentFixture<PagebleFilterInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagebleFilterInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagebleFilterInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
