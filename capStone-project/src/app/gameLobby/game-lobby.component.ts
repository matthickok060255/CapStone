import { Component, OnInit } from '@angular/core';
import { Game } from '../domainObjects/game';

@Component({
  selector: 'game-lobby-component',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.scss']
})
export class GameLobbyComponent implements OnInit  {
  public games: Game[] = [];


  ngOnInit() {

    //FOR TEST PURPOSES ONLY
    let game1 = new Game("Game1", 15, 10, 3, true, true, true, "", new Date(), 120);
    let game2 = new Game("Game2", 10, 10, 2, false, true, true, "password", new Date(), 120);
    let game3 = new Game("Game3", 15, 10, 3, true, false, true, "", new Date(), 60);
    let game4 = new Game("Game4", 10, 8, 1, false, false, false, "", new Date(), 60);
    let game5 = new Game("Game5", 15, 10, 3, true, true, true, "", new Date(), 0);

    this.games.push(game1);
    this.games.push(game2);
    this.games.push(game3);
    this.games.push(game4);
    this.games.push(game5);
    console.log("Test");
}

}
