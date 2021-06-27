import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NaviationBarComponent } from './navigation-bar.component';

class mockActivatedRoute {
  queryParams = {
    subscribe: function() {}
  };
}

class mockRouter {
  navigateByUrl(url: any, extras?: any): any {
    return null;
  }
}

describe('NaviationBarComponent', () => {
  let component: NaviationBarComponent;
  let fixture: ComponentFixture<NaviationBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ NaviationBarComponent ],
      providers: [{provide: ActivatedRoute, useClass: mockActivatedRoute},
        {provide: Router, useClass: mockRouter}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NaviationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle theme', () => {
    expect(component.bulb).toBe("lightbulb_outline");
    component.toggleTheme();
    expect(component.bulb).toBe("lightbulb");
  });
});
