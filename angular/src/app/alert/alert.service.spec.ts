import { inject, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { User } from '../domainObjects/user';
import { AlertService } from './alert.service';

class mockRouter {
  navigateByUrl(url: any, extras?: any): any {
    return null;
  }

  navigate(commands: any[], extras?: any): any {
    return null;
  }
}

describe('AlertService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertService,
        {provide: Router, useClass: mockRouter},],
      imports: [HttpClientTestingModule],
    });
  });

  it('should alert', inject([HttpTestingController, AlertService],
    (httpMock: HttpTestingController, service: AlertService) => {
      service.onAlert("test")
    expect(service).toBeTruthy();
  }));

  it('should call success alert', inject([HttpTestingController, AlertService],
    (httpMock: HttpTestingController, service: AlertService) => {
      let spy = spyOn(service, "alert");
      service.success("test");
      expect(spy).toHaveBeenCalled();
  }));

  it('should call error alert', inject([HttpTestingController, AlertService],
    (httpMock: HttpTestingController, service: AlertService) => {
      let spy = spyOn(service, "alert");
      service.error("test");
      expect(spy).toHaveBeenCalled();
  }));

  it('should call info alert', inject([HttpTestingController, AlertService],
    (httpMock: HttpTestingController, service: AlertService) => {
      let spy = spyOn(service, "alert");
      service.info("test");
      expect(spy).toHaveBeenCalled();
  }));

  it('should call warn alert', inject([HttpTestingController, AlertService],
    (httpMock: HttpTestingController, service: AlertService) => {
      let spy = spyOn(service, "alert");
      service.warn("test");
      expect(spy).toHaveBeenCalled();
  }));

  it('should call clear', inject([HttpTestingController, AlertService],
    (httpMock: HttpTestingController, service: AlertService) => {
      let spy = spyOn(service, "clear");
      service.clear();
      expect(spy).toHaveBeenCalled();
  }));

});
