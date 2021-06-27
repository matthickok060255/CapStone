import { inject, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AccountService } from './account.service';
import { Router } from '@angular/router';
import { User } from '../domainObjects/user';

class mockRouter {
  navigateByUrl(url: any, extras?: any): any {
    return null;
  }

  navigate(commands: any[], extras?: any): any {
    return null;
  }
}

describe('AccountService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountService,
        {provide: Router, useClass: mockRouter},],
      imports: [HttpClientTestingModule],
    });
  });

  it('should login', inject([HttpTestingController, AccountService],
    (httpMock: HttpTestingController, service: AccountService) => {
      service.login("name", "password");
    expect(service).toBeTruthy();
  }));

  it('should logout', inject([HttpTestingController, AccountService],
    (httpMock: HttpTestingController, service: AccountService) => {
      service.logout();
      expect(service.userValue.username).toBeUndefined();
  }));

  it('should create new user', inject([HttpTestingController, AccountService],
    (httpMock: HttpTestingController, service: AccountService) => {
      let user: User = new User();
      user.firstName = "firstName";
      user.lastName = "lastname";
      user.password = "password"
      service.register(user);
      expect(service).toBeTruthy();

  }));

  it('should get All users', inject([HttpTestingController, AccountService],
    (httpMock: HttpTestingController, service: AccountService) => {
      service.getAll();
    expect(service).toBeTruthy();
  }));

  it('should get user by id', inject([HttpTestingController, AccountService],
    (httpMock: HttpTestingController, service: AccountService) => {
      service.getById("testId");
    expect(service).toBeTruthy();
  }));

  it('should update user', inject([HttpTestingController, AccountService],
    (httpMock: HttpTestingController, service: AccountService) => {
      service.update("test", "test");
    expect(service).toBeTruthy();
  }));

  it('should delete user', inject([HttpTestingController, AccountService],
    (httpMock: HttpTestingController, service: AccountService) => {
      service.delete("testId");
    expect(service).toBeTruthy();
  }));
});
