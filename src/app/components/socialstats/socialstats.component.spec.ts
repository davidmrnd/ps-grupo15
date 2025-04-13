import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialstatsComponent } from './socialstats.component';

describe('SocialstatsComponent', () => {
  let component: SocialstatsComponent;
  let fixture: ComponentFixture<SocialstatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialstatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialstatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
