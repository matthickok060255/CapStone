import { Component, OnDestroy, OnInit } from '@angular/core';
import { Board } from '../domainObjects/board';
import { ActiveGameService } from './active-game.service';
import Pusher from 'pusher-js';
import { User } from '../domainObjects/user';
import { AccountService } from '../account/account.service';
import { Game } from '../domainObjects/game';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateGameService } from '../create-game/create-game.service';
import { Subscription } from 'rxjs';

// set game constants
const NUM_PLAYERS: number = 2;
const BOARD_SIZE: number = 6;

@Component({
  selector: 'active-game-component',
  templateUrl: './active-game.component.html',
  styleUrls: ['./active-game.component.scss'],
  providers: [ActiveGameService]
})
export class ActiveGameComponent implements OnInit, OnDestroy {
  canPlay: boolean = true;
  player: number = 0;
  gameId!: number;
  game!: Game;
  gameUrl: string = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + "/activeGame";
  pusherChannel: any;
  players: any[] = [];
  pusherIdToUserNameMap = new Map<string, string>();  //NEED TO CHANGE TO REFERENCE FULL ACTIVE USER OBJECT
  user: User;
  role!: string; // CHANGE TO ENUM

  private subscriptions: Subscription[] = []

  constructor(
    private activeGameService: ActiveGameService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private createGameService: CreateGameService,
  ) {
    this.user = this.accountService.userValue;
    this.role = String(localStorage.getItem("role"));
    this.pusherIdToUserNameMap.set(this.user.id, this.user.username);

    this.initPusher();

  }

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe(params => {
      this.gameId = params['id'];
      if (this.gameId) {
        this.listenForChanges();
        this.createGameService.getGamebyId(this.gameId).subscribe(game => {
          console.log(game);
          this.game = game;
        });
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }


  // initialise Pusher and bind to presence channel
  initPusher(): ActiveGameComponent {
    // init pusher
    const pusher = new Pusher('cd3b623ce769e9f6154f', {
      authEndpoint: 'http://localhost:3000/pusher/auth',
      cluster: 'us2',
    });

    // bind to relevant Pusher presence channel
    this.pusherChannel = pusher.subscribe("presence-active-game-" + this.gameId);

    return this;
  }

  // initialise player and set turn
  sendPlayerInfo(user: User) {
    console.log("Send User Info to other users");
    this.pusherChannel.trigger('client-presence-active-game-' + this.gameId, user);
  }

  // initialise player and set turn
  removePlayerInfo(user: User) {
    console.log("Send User Info to other users");
    this.pusherChannel.trigger('client-presence-active-game-remove-' + this.gameId, user);
  }

  // Listen for `client-fire` events.
  // Update the board object and other properties when
  // event triggered
  listenForChanges(): ActiveGameComponent {

    //A memeber has left the game
    this.pusherChannel.bind('pusher:member_removed', (member: any) => {
      this.removePlayerInfo(this.user)
    });
    this.pusherChannel.bind('client-presence-active-game-remove-' + this.gameId, (member: User) => {
      this.pusherIdToUserNameMap.delete(member.id);
    });

    // A member has joined the game
    this.pusherChannel.bind('pusher:subscription_succeeded', (members: any) => {
      this.players.push(members);
      this.pusherIdToUserNameMap.set(this.user.id, this.user.username);
      this.sendPlayerInfo(this.user);
      //this.toastr.success("Success", 'Connected!');
    })
    this.pusherChannel.bind('client-presence-active-game-' + this.gameId, (member: User) => {
      if (!this.pusherIdToUserNameMap.has(member.id)) {
        this.pusherIdToUserNameMap.set(member.id, member.username);

        this.sendPlayerInfo(this.user);
      }
    });

    //Listen For Role Assignment
    this.pusherChannel.bind('client-presence-active-game-' + this.gameId + "-" + this.user.id, (role: string) => {
        this.role = role;
        localStorage.setItem('role', role);
    });
    //Listen for vote changes

    //Listen for chat
    return this;
  }

  assignRoles() {
    console.log("Assigning Roles");
    let rolesMap = this.createRoles();

    rolesMap.forEach((value: string, userId: string) => {
      if (userId !== this.user.id) {
        this.pusherChannel.trigger('client-presence-active-game-' + this.gameId + "-" + userId, value);
      } else {
        this.role = value;
        localStorage.setItem('role', value);
      }

    });
  }

  createRoles(): Map<string, string> {
    let roleMap = new Map<string, string>();

    let totalPlayers = this.pusherIdToUserNameMap.size;
    let cop: number = this.game.cop ? 1 : 0;
    let reporter: number = this.game.reporter ? 1 : 0;
    let psychic: number = this.game.psychic ? 1 : 0;

    let numVillagers = totalPlayers - this.game.numWerewolfPlayers;

    let villagerCount = 0;
    let werewolfCount = 0;
    this.pusherIdToUserNameMap.forEach((value: string, key: string) => {
      let randomSeed = Math.random();
      if (randomSeed < this.game.numWerewolfPlayers / totalPlayers) {
        if (werewolfCount < this.game.numWerewolfPlayers) {
          roleMap.set(key, "werewolf");
          werewolfCount++;
        } else {
          roleMap.set(key, "villager");
          villagerCount++;
        }
      }else if (randomSeed < (this.game.numWerewolfPlayers / totalPlayers) + (numVillagers / totalPlayers)) {
        if (villagerCount < numVillagers) {
          roleMap.set(key, "villager");
          villagerCount++;
        } else {
          roleMap.set(key, "werewolf");
          werewolfCount++;
        }
      }
    });

    return roleMap;
  }

  isCreator(): boolean {
    return this.user.username === this.game.createdBy;
  }

  // check if player is a valid player for the game
  get validPlayer(): boolean {
    return this.pusherIdToUserNameMap.has(this.user.id);
  }

  checkGameState(boardId: number, tile: any): boolean {
    if (boardId == this.player) {
      // this.toastr.error("Don't commit suicide.", "You can't hit your own board.")
      return false;
    }
    if (false) {
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
}
