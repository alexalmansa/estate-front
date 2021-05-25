import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterationDetailsComponent } from './alteration-details.component';

describe('AlterationDetailsComponent', () => {
  let component: AlterationDetailsComponent;
  let fixture: ComponentFixture<AlterationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlterationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
