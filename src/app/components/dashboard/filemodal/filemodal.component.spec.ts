import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilemodalComponent } from './filemodal.component';

describe('FilemodalComponent', () => {
  let component: FilemodalComponent;
  let fixture: ComponentFixture<FilemodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilemodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
