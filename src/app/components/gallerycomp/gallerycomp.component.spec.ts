import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GallerycompComponent } from './gallerycomp.component';

describe('GallerycompComponent', () => {
  let component: GallerycompComponent;
  let fixture: ComponentFixture<GallerycompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GallerycompComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GallerycompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
