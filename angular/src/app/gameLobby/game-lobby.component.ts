import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../domainObjects/game';
import { Subscription } from 'rxjs';

import { GameLobbyService } from './game-lobby.service';
import { Router } from '@angular/router';

@Component({
  selector: 'game-lobby-component',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.scss']
})
export class GameLobbyComponent implements OnInit, OnDestroy {
  public games: Game[] = [];
  private subscriptions: Subscription[] = []

  constructor(private gameLobbyService: GameLobbyService,
    private router: Router) { }


  ngOnInit() {

    this.subscriptions.push(this.gameLobbyService.getGames().subscribe(games => {
      this.games = games;
    }));

  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  joinGame(id: number) {
    this.router.navigateByUrl("createGame/" + id);
  }
}

