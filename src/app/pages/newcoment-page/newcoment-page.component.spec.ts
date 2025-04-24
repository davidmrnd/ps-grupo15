import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcomentPageComponent } from './newcoment-page.component';

describe('NewcomentPageComponent', () => {
  let component: NewcomentPageComponent;
  let fixture: ComponentFixture<NewcomentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewcomentPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewcomentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
