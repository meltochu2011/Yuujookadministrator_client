import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcompartidoComponent } from './ccompartido.component';

describe('CcompartidoComponent', () => {
  let component: CcompartidoComponent;
  let fixture: ComponentFixture<CcompartidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcompartidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcompartidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
