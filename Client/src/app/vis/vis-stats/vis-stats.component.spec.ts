import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisStatsComponent } from './vis-stats.component';

describe('VisStatsComponent', () => {
  let component: VisStatsComponent;
  let fixture: ComponentFixture<VisStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
