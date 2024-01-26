import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditdishDetailComponent } from './editdish-detail.component';

describe('EditdishDetailComponent', () => {
  let component: EditdishDetailComponent;
  let fixture: ComponentFixture<EditdishDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditdishDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditdishDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
