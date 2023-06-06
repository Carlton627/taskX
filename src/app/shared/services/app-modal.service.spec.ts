import { TestBed } from '@angular/core/testing';

import { AppModalService } from './app-modal.service';

describe('AppModalService', () => {
  let service: AppModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
