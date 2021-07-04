import { Component } from '@angular/core';
import { Board } from '../domainObjects/board';
import { ActiveGameService } from './active-game.service';
import Pusher from 'pusher-js';

// set game constants
const NUM_PLAYERS: number = 2;
const BOARD_SIZE: number = 6;

@Component({
  selector: 'active-game-component',
  templateUrl: './active-game.component.html',
  styleUrls: ['./active-game.component.scss'],
  providers: [ActiveGameService]
})
export class ActiveGameComponent {
  canPlay: boolean = true;
  player: number = 0;
  players: number = 0;
  gameId!: string;
  gameUrl: string = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + "/activeGame";
  pusherChannel: any;

  constructor(
    private activeGameService: ActiveGameService
  ) {
    this.createBoards();

    this.initPusher();
    this.listenForChanges();
  }


  // initialise Pusher and bind to presence channel
  initPusher(): ActiveGameComponent {
    console.log(this.gameUrl);
    // findOrCreate unique channel ID
    let id = this.getQueryParam('id');
    if (!id) {
      id = this.getUniqueId();
      location.search = location.search ? '&id=' + id : 'id=' + id;
    }
    this.gameId = id;

    // init pusher
    const pusher = new Pusher('cd3b623ce769e9f6154f', {
      authEndpoint: 'http://localhost:3000/pusher/auth',
      cluster: 'us2',
    });

    // bind to relevant Pusher presence channel
    this.pusherChannel = pusher.subscribe(this.gameId);
    this.pusherChannel.bind('pusher:member_added', () => { this.players++ })
    this.pusherChannel.bind('pusher:subscription_succeeded', (members: { count: number; }) => {
      this.players = members.count;
      console.log(this.players);
      this.setPlayer(this.players);
      //this.toastr.success("Success", 'Connected!');
    })
    this.pusherChannel.bind('pusher:member_removed', () => { this.players-- });

    return this;
  }

  // Listen for `client-fire` events.
  // Update the board object and other properties when
  // event triggered
  listenForChanges(): ActiveGameComponent {
    this.pusherChannel.bind('client-fire', (obj: any) => {
      this.canPlay = !this.canPlay;
      this.boards[obj.boardId] = obj.board;
      this.boards[obj.player].player.score = obj.score;
    });
    return this;
  }

  // initialise player and set turn
  setPlayer(players: number = 0): ActiveGameComponent {
    this.player = players - 1;
    if (players == 1) {
      this.canPlay = true;
    } else if (players == 2) {
      this.canPlay = false;
    }
    return this;
  }

  // helper function to get a query param
  getQueryParam(name: any) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  // helper function to create a unique presence channel
  // name for each game
  getUniqueId() {
    return 'presence-' + Math.random().toString(36).substr(2, 8);
  }

  // check if player is a valid player for the game
  get validPlayer(): boolean {
    return (this.players >= NUM_PLAYERS) && (this.player < NUM_PLAYERS);
  }

  // event handler for click event on
  // each tile - fires torpedo at selected tile
  fireTorpedo(e: any): ActiveGameComponent {
    let id = e.target.id,
      boardId = id.substring(1, 2),
      row = id.substring(2, 3), col = id.substring(3, 4),
      tile = this.boards[boardId].tiles[row][col];
    if (!this.checkValidHit(boardId, tile)) {
      return this;
    }

    if (tile.value == 1) {
    //  this.toastr.success("You got this.", "HURRAAA! YOU SANK A SHIP!");
      this.boards[boardId].tiles[row][col].status = 'win';
      this.boards[this.player].player.score++;
    } else {
    //  this.toastr.info("Keep trying.", "OOPS! YOU MISSED THIS TIME");
      this.boards[boardId].tiles[row][col].status = 'fail'
    }
    this.canPlay = false;
    this.boards[boardId].tiles[row][col].used = true;
    this.boards[boardId].tiles[row][col].value = "X";

    // trigger `client-fire` event once a torpedo
    // is successfully fired
    this.pusherChannel.trigger('client-fire', {
      player: this.player,
      score: this.boards[this.player].player.score,
      boardId: boardId,
      board: this.boards[boardId]
    });
    return this;
  }

  checkValidHit(boardId: number, tile: any): boolean {
    if (boardId == this.player) {
     // this.toastr.error("Don't commit suicide.", "You can't hit your own board.")
      return false;
    }
    if (this.winner) {
     // this.toastr.error("Game is over");
      return false;
    }
    if (!this.canPlay) {
    //  this.toastr.error("A bit too eager.", "It's not your turn to play.");
      return false;
    }
    if (tile.value == "X") {
    //  this.toastr.error("Don't waste your torpedos.", "You already shot here.");
      return false;
    }
    return true;
  }

  createBoards(): ActiveGameComponent {
    for (let i = 0; i < NUM_PLAYERS; i++)
      this.activeGameService.createBoard(BOARD_SIZE);
    return this;
  }

  // winner property to determine if a user has won the game.
  // once a user gets a score higher than the size of the game
  // board, he has won.
  get winner(): any {
    return this.boards.find(board => board.player.score >= BOARD_SIZE);
  }

  // get all boards and assign to boards property
  get boards(): Board[] {
    return this.activeGameService.getBoards()
  }
}
