import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCategorySelectorComponent } from './task-category-selector.component';

describe('TaskCategorySelectorComponent', () => {
  let component: TaskCategorySelectorComponent;
  let fixture: ComponentFixture<TaskCategorySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskCategorySelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskCategorySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
