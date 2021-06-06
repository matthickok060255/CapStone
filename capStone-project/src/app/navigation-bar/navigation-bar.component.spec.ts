import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NaviationBarComponent } from './navigation-bar.component';



describe('NaviationBarComponent', () => {
  let component: NaviationBarComponent;
  let fixture: ComponentFixture<NaviationBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NaviationBarComponent ]
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