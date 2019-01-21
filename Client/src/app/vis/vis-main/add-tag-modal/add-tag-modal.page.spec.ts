import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTagModalPage } from './add-tag-modal.page';

describe('AddTagModalPage', () => {
  let component: AddTagModalPage;
  let fixture: ComponentFixture<AddTagModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTagModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTagModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
