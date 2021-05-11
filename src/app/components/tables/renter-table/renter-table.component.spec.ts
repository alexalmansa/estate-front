import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenterTableComponent } from './renter-table.component';

describe('RenterTableComponent', () => {
  let component: RenterTableComponent;
  let fixture: ComponentFixture<RenterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenterTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
