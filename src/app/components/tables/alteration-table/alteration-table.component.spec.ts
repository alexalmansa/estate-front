import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterationTableComponent } from './alteration-table.component';

describe('AlterationTableComponent', () => {
  let component: AlterationTableComponent;
  let fixture: ComponentFixture<AlterationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlterationTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
