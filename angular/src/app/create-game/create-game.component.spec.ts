import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Params, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CreateGameComponent } from './create-game.component';

class mockActivatedRoute {
  queryParams = {
    subscribe: function() {}
  };
}

describe('CreateGameComponent', () => {
  let component: CreateGameComponent;
  let fixture: ComponentFixture<CreateGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGameComponent ],
      providers: [{provide: ActivatedRoute, useClass: mockActivatedRoute}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
