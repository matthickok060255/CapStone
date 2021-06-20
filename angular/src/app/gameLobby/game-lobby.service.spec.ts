import { inject, TestBed } from '@angular/core/testing';
import { GameLobbyService } from './game-lobby.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';


describe('GameLobbyService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameLobbyService],
      imports: [HttpClientTestingModule],
    });
  });

  it('should get games', inject([HttpTestingController, GameLobbyService],
    (httpMock: HttpTestingController, service: GameLobbyService) => {
    expect(service).toBeTruthy();
  }));
});
