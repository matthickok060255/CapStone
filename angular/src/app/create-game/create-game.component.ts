import { gameState } from './../domainObjects/gameStateEnum';
import { CreateGameService } from './create-game.service';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../domainObjects/game';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Pusher from 'pusher-js';
import { User } from '../domainObjects/user';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'create-game-component',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit, OnDestroy {
  private gameId!: number;
  private subscriptions: Subscription[] = []
  private game!: Game;

  pusherChannel: any;
  players: any[] = [];
  pusherIdToUserNameMap = new Map<string, string>();
  user: User;

  createGameForm!: FormGroup;
  isActive: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private createGameService: CreateGameService,
    private accountService: AccountService
  ) {
    this.user = this.accountService.userValue;
  }

  // initialise Pusher and bind to presence channel
  initPusher(): CreateGameComponent {

    // init pusher
    const pusher = new Pusher('cd3b623ce769e9f6154f', {
      authEndpoint: 'http://localhost:3000/pusher/auth',
      cluster: 'us2',
    });

    // bind to relevant Pusher presence channel
    this.pusherChannel = pusher.subscribe("presence-created-game-" + this.gameId);
    this.pusherChannel.bind('client-presence-created-game-' + this.gameId, (member: User) => {
      if (!this.pusherIdToUserNameMap.has(member.id)) {
        this.pusherIdToUserNameMap.set(member.id, member.username);
        this.sendPlayerInfo(this.user);
      }
    });

    this.pusherChannel.bind('client-presence-created-game-remove-' + this.gameId, (member: User) => {
      this.pusherIdToUserNameMap.delete(member.id);
    });
    this.pusherChannel.bind('pusher:subscription_succeeded', (members: any) => {
      this.players.push(members);
      this.pusherIdToUserNameMap.set(this.user.id, this.user.username);
      this.sendPlayerInfo(this.user);
      //this.toastr.success("Success", 'Connected!');
    })
    this.pusherChannel.bind('pusher:member_removed', (member: any) => {
      this.removePlayerInfo(this.user)
    });
    return this;
  }

  // initialise player and set turn
  sendPlayerInfo(user: User) {
    console.log("Send User Info to other users");
    this.pusherChannel.trigger('client-presence-created-game-' + this.gameId, user);
  }

  // initialise player and set turn
  removePlayerInfo(user: User) {
    console.log("Send User Info to other users");
    this.pusherChannel.trigger('client-presence-created-game-remove-' + this.gameId, user);
  }

  startActiveGame() {
    this.router.navigate(["/activeGame/" + this.gameId]);
  }



  ngOnInit() {
    this.createGameForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['',],
      maxPlayers: [25,],
      minPlayers: [5, Validators.min(5)],
      numWerewolfPlayers: ['', Validators.required],
      psychic: [false, Validators.required],
      reporter: [false, Validators.required],
      cop: [false, Validators.required],
      roundTimer: [0, Validators.required],
    });

    this.subscriptions.push(this.route.params.subscribe(params => {
      this.gameId = params['id'];
      if (this.gameId) {
        this.initPusher();
        this.isActive = true;
        this.createGameService.getGamebyId(this.gameId).subscribe(game => {
          this.game = game;
          this.createGameForm.controls['name'].setValue(game.name);
          this.createGameForm.controls['password'].setValue(game.password);
          this.createGameForm.controls['maxPlayers'].setValue(game.maxPlayers);
          this.createGameForm.controls['minPlayers'].setValue(game.minPlayers);
          this.createGameForm.controls['numWerewolfPlayers'].setValue(game.numWerewolfPlayers);
          this.createGameForm.controls['psychic'].setValue(game.psychic);
          this.createGameForm.controls['reporter'].setValue(game.reporter);
          this.createGameForm.controls['cop'].setValue(game.cop);
          this.createGameForm.controls['roundTimer'].setValue(game.roundTimer);
        });
      }
    }));

  }

  onSubmit() {
    // stop here if form is invalid
    if (this.createGameForm.invalid) {
      console.log("Invalid");
      return;
    }

    let newGame = new Game(this.createGameForm.controls['name'].value,
      this.createGameForm.controls['maxPlayers'].value,
      this.createGameForm.controls['minPlayers'].value,
      1,
      this.createGameForm.controls['numWerewolfPlayers'].value,
      this.createGameForm.controls['psychic'].value,
      this.createGameForm.controls['reporter'].value,
      this.createGameForm.controls['cop'].value,
      this.createGameForm.controls['password'].value,
      new Date(),
      0,
      gameState.CREATED)
    this.createGameService.createGame(newGame)
      .subscribe(data => {
        this.router.navigate(["/createGame/" + data.id]);
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.createGameForm.controls; }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }
}



