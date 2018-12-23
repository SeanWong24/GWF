import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { VisControlComponent } from "./vis-control.component";

describe("VisControlComponent", () => {
  let component: VisControlComponent;
  let fixture: ComponentFixture<VisControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
