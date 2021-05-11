import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseTableComponent } from './lease-table.component';

describe('LeaseTableComponent', () => {
  let component: LeaseTableComponent;
  let fixture: ComponentFixture<LeaseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaseTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
