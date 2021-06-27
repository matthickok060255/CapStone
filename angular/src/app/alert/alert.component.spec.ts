import { Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, Subscription } from 'rxjs';
import { Game } from '../domainObjects/game';
import { AlertComponent } from './alert.component';
import { AlertService } from './alert.service';
import { Alert } from '../domainObjects/alert';



describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  class mockRouter {
    events: any = {
      subscribe: function(){}
    }
    navigateByUrl(url: any, extras?: any): any {
      return null;
    }
  }


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertComponent ],
      providers: [{provide: Router, useClass: mockRouter},
        {provide: AlertService, useClass: AlertService},
        ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should remove alert', () => {
    component.removeAlert(new Alert());
    expect(component.alerts.length).toBe(0);
    let alert: Alert = new Alert();
    alert.id = "test";
    alert.fade = false;
    component.alerts.push(alert);
    component.removeAlert(alert);
    expect(component.alerts.length).toBe(1);
    alert.fade = true;
    component.removeAlert(alert);
    expect(component).toBeTruthy();
  });

  it('should css class', () => {
    let alert: Alert = new Alert();
    alert.id = "test";
    alert.fade = true;
    let classes = component.cssClass(alert);
    expect(classes).toBe("alert alert-dismissable mt-4 container  fade");
  });


});
