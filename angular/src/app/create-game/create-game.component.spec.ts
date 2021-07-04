import { CreateGameService } from './create-game.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { User } from '../domainObjects/user';
import { CreateGameComponent } from './create-game.component';
import { FormBuilder } from '@angular/forms';
import { AccountService } from '../account/account.service';
import { Game } from '../domainObjects/game';
import { gameState } from '../domainObjects/gameStateEnum';

class mockActivatedRoute {
  params = of({id: "test"})
}

class mockRouter {
  navigateByUrl(url: any, extras?: any): any {
    return null;
  }

  navigate(commands: any[], extras?: any): any {
    return null;
  }
}

class mockAccountService {
  login(user: User): Observable<any> {
    return of(null);
  }
}

class mockCreateGameService {
  createGame(game: Game): Observable<any> {
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
    return of(newGame);
  }

   /**
   * Gets all of the current games that can be joined
   * @returns Observable<Game>
   */
    getGamebyId(id: number): Observable<any> {
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
      return of(newGame);
    }

}

describe('CreateGameComponent', () => {
  let component: CreateGameComponent;
  let fixture: ComponentFixture<CreateGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGameComponent ],
      providers: [{provide: ActivatedRoute, useClass: mockActivatedRoute},
                  {provide: Router, useClass: mockRouter},
                  {provide: FormBuilder},
                  {provide: AccountService, useClass: mockAccountService},
                  {provide: CreateGameService, useClass: mockCreateGameService}
                ]
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

  it('should int pushers', () => {
    component.initPusher();
    expect(component).toBeTruthy();
  });

  it('should submit request', () => {
    component.onSubmit();
    expect(component).toBeTruthy();
  });

  it('should sendPlayerInfo', () => {
    component.pusherChannel = {
      trigger: function() {}
    }
    let user = new User();
    user.id = "testId";
    user.username = "testUsername";
    component.sendPlayerInfo(user);
    expect(component).toBeTruthy();
  });

  it('should removePlayerInfo ', () => {
    component.pusherChannel = {
      trigger: function() {}
    }
    let user = new User();
    user.id = "testId";
    user.username = "testUsername";
    component.removePlayerInfo(user);
    expect(component).toBeTruthy();
  });

  it('should startActiveGame request', () => {
    component.pusherChannel = {
      trigger: function() {}
    }
    component.startActiveGame();
    expect(component).toBeTruthy();
  });
});
