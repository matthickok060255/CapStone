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
  idToUserNameMap = new Map<string, User>();
  isDay: boolean = true;
  hasVoted: boolean = false;
  isEliminated: boolean = false;
  hasGameStarted: boolean = false;
  werewolvesWon: boolean = false;
  villagersWon: boolean = false;
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
    this.idToUserNameMap.set(this.user.id, this.user);



  }

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe(params => {
      this.gameId = params['id'];
      if (this.gameId) {
        this.initPusher();
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

  // Remove PLayer
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
      this.idToUserNameMap.delete(member.id);
    });

    // A member has joined the game
    this.pusherChannel.bind('pusher:subscription_succeeded', (members: any) => {
      this.players.push(members);
      this.idToUserNameMap.set(this.user.id, this.user);
      this.sendPlayerInfo(this.user);
      //this.toastr.success("Success", 'Connected!');
    })
    this.pusherChannel.bind('client-presence-active-game-' + this.gameId, (member: User) => {
      if (!this.idToUserNameMap.has(member.id)) {
        this.idToUserNameMap.set(member.id, member);

        this.sendPlayerInfo(this.user);
      }
    });

    //Listen For Role Assignment
    this.pusherChannel.bind('client-presence-active-game-roles' + this.gameId, (users: User[]) => {
      this.resetGame();
      users.forEach(user => {
        this.idToUserNameMap.set(user.id, user);
        if (user.id === this.user.id) {
          this.user = user;
          this.role = user.role;
          this.hasGameStarted = true;
        }
      });
    });

    // Listen for Vote / Cycle Change
    this.pusherChannel.bind('client-presence-active-game-vote-' + this.gameId, (user: User) => {
      this.idToUserNameMap.set(user.id, user);
      // Check if everyone has voted to move to next cycle and resolve
      this.checkCycles();
    });
    //Listen for chat
    return this;
  }

  private checkCycles() {
    let voteCount: number = 0
    let wasTie = false;
    let highVoteUser: User = new User();
    this.idToUserNameMap.forEach(((user: User, userId: string) => {
      user.voteCount = user.voteCount ? user.voteCount : 0;

      if (!highVoteUser.id) {
        highVoteUser = user;
      } else if (user.voteCount > highVoteUser.voteCount) {
        highVoteUser = user;
        wasTie = false;
      } else if (user.voteCount === highVoteUser.voteCount) {
        wasTie = true;
      }

      voteCount = voteCount + user.voteCount;


    }));

    if (this.isDay && voteCount === this.getActiveNumPlayers()) {
      this.eliminatePlayer(highVoteUser, wasTie);
    }

    if (!this.isDay && voteCount === this.getActiveNumWerewolves()) {
      this.eliminatePlayer(highVoteUser, wasTie);
    }


  }

  private eliminatePlayer(highVoteUser: User, wasTie: boolean) {
    console.log("Switch to the next Cycle");
    this.hasVoted = false;
    this.isDay = !this.isDay;

    if (!wasTie) {
      let eliminatedUser = this.idToUserNameMap.get(highVoteUser.id);
      if (eliminatedUser) {
        eliminatedUser.isEliminated = true;
      }

      if (this.user.id === highVoteUser.id) {
        this.isEliminated = true;
      }
    }
    this.resetVoteCounts();
    this.isGameOver();
  }

  private isGameOver() {
    //check number of werewolves vs rest of player
    let villagerCount: number = 0;
    let werewolfCount: number = 0;
    this.idToUserNameMap.forEach((user: User, key: string) => {
      user.isEliminated = user.isEliminated ? user.isEliminated : false;
      if (!user.isEliminated && user.role === "werewolf") {
        werewolfCount++;
      } else if (!user.isEliminated) {
        villagerCount++;
      }
    });
    if (werewolfCount === 0) {
      this.villagersWon = true;
      this.hasGameStarted = false;
    }
    if (werewolfCount >= villagerCount) {
      this.werewolvesWon = true;
      this.hasGameStarted = false;
    }
  }

  private resetVoteCounts() {
    this.idToUserNameMap.forEach(((user: User, userId: string) => {
      user.voteCount = 0;
    }));
  }

  private getActiveNumWerewolves(): number {
    let count = 0;
    this.idToUserNameMap.forEach(((user: User, userId: string) => {
      if (!user.isEliminated && user.role === "werewolf") {
        count = count + 1;
      }
    }));
    return count;
  }

  private getActiveNumPlayers(): number {
    let count = 0;
    this.idToUserNameMap.forEach(((user: User, userId: string) => {
      if (!user.isEliminated) {
        count = count + 1;
      }
    }));
    return count;
  }

  assignRoles() {
    console.log("Assigning Roles");
    let rolesMap = this.createRoles();
    let users: User[] = [];

    rolesMap.forEach((value: string, userId: string) => {
      let user = this.idToUserNameMap.get(userId);
      if (user) {

        user.role = value;

        if (user.id === this.user.id) {
          this.user = user;
          this.role = user.role;
          this.hasGameStarted = true;
        }

        users.push(user);
      }
    });
    this.resetGame();
    this.pusherChannel.trigger('client-presence-active-game-roles' + this.gameId, users);
  }

  private resetGame() {
    this.isDay = true;
    this.hasVoted = false;
    this.villagersWon = false;
    this.werewolvesWon = false;
    this.isEliminated = false;
    this.idToUserNameMap.forEach(((user: User, userId: string) => {
      user.isEliminated = false;
      user.voteCount = 0;
    }));
  }

  createRoles(): Map<string, string> {
    let roleMap = new Map<string, string>();

    let totalPlayers = this.idToUserNameMap.size;
    // NEED TO IMPLEMENT EXTRA ROLES
    let cop: number = this.game.cop ? 1 : 0;
    let reporter: number = this.game.reporter ? 1 : 0;
    let psychic: number = this.game.psychic ? 1 : 0;

    let numVillagers = totalPlayers - this.game.numWerewolfPlayers;

    let villagerCount = 0;
    let werewolfCount = 0;
    this.idToUserNameMap.forEach((value: User, key: string) => {
      let randomSeed = Math.random();
      if (randomSeed < this.game.numWerewolfPlayers / totalPlayers) {
        if (werewolfCount < this.game.numWerewolfPlayers) {
          roleMap.set(key, "werewolf");
          werewolfCount++;
        } else {
          roleMap.set(key, "villager");
          villagerCount++;
        }
      } else if (randomSeed < (this.game.numWerewolfPlayers / totalPlayers) + (numVillagers / totalPlayers)) {
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
    return this.user.username === this.game.createdBy && !this.hasGameStarted;
  }

  isDayCycle(): boolean {
    return this.isDay;
  }

  isWerewolf(): boolean {
    return !this.isDay && this.role === "werewolf";
  }

  voteClicked(userId: string): void {
    let votedUser = this.idToUserNameMap.get(userId)
    if (votedUser) {
      this.hasVoted = true;
      votedUser.voteCount = votedUser.voteCount ? votedUser.voteCount + 1 : 1;
      this.pusherChannel.trigger('client-presence-active-game-vote-' + this.gameId, votedUser);
      this.checkCycles();
    }


  }

  // check if player is a valid player for the game
  get validPlayer(): boolean {
    return this.idToUserNameMap.has(this.user.id);
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
