import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleRoadComponent } from './singleroad.component';

describe('SingleroadComponent', () => {
  let component: SingleRoadComponent;
  let fixture: ComponentFixture<SingleRoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleRoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleRoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
