import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMovieModalComponent } from './add-movie-modal.component';

describe('AddMovieModalComponent', () => {
  let component: AddMovieModalComponent;
  let fixture: ComponentFixture<AddMovieModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMovieModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMovieModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
