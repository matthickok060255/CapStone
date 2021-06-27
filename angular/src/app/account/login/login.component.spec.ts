import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AccountService } from '../account.service';
import { User } from 'src/app/domainObjects/user';
import { Observable, of } from 'rxjs';
import { LoginComponent } from './login.component';

class mockFormBuilder {
   group() {

  }
}

class mockRouter {
  navigateByUrl(url: any, extras?: any): any {
    return null;
  }

  navigate() {}
}

class mockActivatedRoute {
  queryParams = {
    subscribe: function() {}
  };


    snapshot: any =  {
      queryParams: {
        'returnUrl': 'testUrl'
      }
    }
}

class mockAccountService {
  login(user: User): Observable<any> {
    return of(null);
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ LoginComponent ],
      providers: [{provide: FormBuilder, useClass: mockFormBuilder},
        {provide: Router, useClass: mockRouter},
        {provide: ActivatedRoute, useClass: mockActivatedRoute},
      {provide: AccountService, useClass: mockAccountService}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit request', inject([HttpTestingController, AccountService],
    (httpMock: HttpTestingController, service: AccountService) => {
    let spy = spyOn(service, "login").and.callThrough();
    component.loginForm = new FormGroup({
      username: new FormControl('username', Validators.required),
      password: new FormControl('password', Validators.required),
    });
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  }));
});
