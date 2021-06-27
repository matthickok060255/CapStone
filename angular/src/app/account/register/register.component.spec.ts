import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AccountService } from '../account.service';
import { User } from 'src/app/domainObjects/user';
import { Observable, of } from 'rxjs';

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
}

class mockAccountService {
  register(user: User): Observable<any> {
    return of(null);
  }
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ RegisterComponent ],
      providers: [{provide: FormBuilder, useClass: mockFormBuilder},
        {provide: Router, useClass: mockRouter},
        {provide: ActivatedRoute, useClass: mockActivatedRoute},
      {provide: AccountService, useClass: mockAccountService}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit request', inject([HttpTestingController, AccountService],
    (httpMock: HttpTestingController, service: AccountService) => {
    let spy = spyOn(service, "register").and.callThrough();
    component.form = new FormGroup({
      firstName: new FormControl('name', Validators.required),
      lastName: new FormControl('last', Validators.required),
      username: new FormControl('username', Validators.required),
      password: new FormControl('password', Validators.required),
    });
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  }));
});
