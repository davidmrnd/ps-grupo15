import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideogameprofilePageComponent } from './videogameprofile-page.component';

describe('VideogameprofilePageComponent', () => {
  let component: VideogameprofilePageComponent;
  let fixture: ComponentFixture<VideogameprofilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideogameprofilePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideogameprofilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
