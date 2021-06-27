
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../domainObjects/game';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'create-game-component',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit, OnDestroy  {
  private gameId!: number;
  private subscriptions: Subscription[] = []
  private game!: Game;

  constructor(
    private route: ActivatedRoute,
  ) {}


  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.gameId = params['gameId'];
      if (this.gameId) {

      } else {

      }
    });

}

ngOnDestroy() {
  this.subscriptions.forEach((subscription) => subscription.unsubscribe())
    }
}



