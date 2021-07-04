import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Game } from '../domainObjects/game';
import { gameState } from '../domainObjects/gameStateEnum';
import { CreateGameService } from './create-game.service';


describe('CreateGameService', () => {
  let service: CreateGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateGameService],
      imports: [HttpClientTestingModule],
    });
  });


  it('should create games', inject([HttpTestingController, CreateGameService],
    (httpMock: HttpTestingController, service: CreateGameService) => {
      let newGame = new Game("name",
      15,
      10,
      1,
      1,
      true,
      false,
      true,
      "",
      new Date(),
      0,
      gameState.CREATED)
      service.createGame(newGame);
    expect(service).toBeTruthy();
  }));

  it('should get game by id', inject([HttpTestingController, CreateGameService],
    (httpMock: HttpTestingController, service: CreateGameService) => {
      service.getGamebyId(10);
    expect(service).toBeTruthy();
  }));
});
