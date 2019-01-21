import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { VisMainComponent } from "./vis-main.component";

describe("VisMainComponent", () => {
  let component: VisMainComponent;
  let fixture: ComponentFixture<VisMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
