import { TestBed } from '@angular/core/testing';

import { AlterationService } from './alteration.service';

describe('AlterationService', () => {
  let service: AlterationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlterationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
