import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcomentComponent } from './newcoment.component';

describe('NewcomentComponent', () => {
  let component: NewcomentComponent;
  let fixture: ComponentFixture<NewcomentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewcomentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewcomentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
