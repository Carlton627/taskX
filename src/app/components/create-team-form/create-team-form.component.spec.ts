import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTeamFormComponent } from './create-team-form.component';

describe('CreateTeamFormComponent', () => {
  let component: CreateTeamFormComponent;
  let fixture: ComponentFixture<CreateTeamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTeamFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTeamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
