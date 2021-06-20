import { Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameLobbyComponent } from './game-lobby.component';
import { GameLobbyService } from './game-lobby.service';
import { Observable, of } from 'rxjs';
import { Game } from '../domainObjects/game';



describe('GameLobbyComponent', () => {
  let component: GameLobbyComponent;
  let fixture: ComponentFixture<GameLobbyComponent>;

  class mockRouter {
    navigateByUrl(url: any, extras?: any): any {
      return null;
    }
  }

  class mockGameLobbyService {
    getGames(): Observable<Game[]> {
      return of([]);
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameLobbyComponent ],
      providers: [{provide: Router, useClass: mockRouter},
        {provide: GameLobbyService, useClass: mockGameLobbyService},
        ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
