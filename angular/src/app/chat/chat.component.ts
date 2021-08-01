import { Component, OnInit, OnDestroy } from "@angular/core";
import Pusher from "pusher-js";
import { Subscription } from "rxjs";
import { AccountService } from "../account/account.service";
import { User } from "../domainObjects/user";

@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class CreateGameComponent implements OnInit, OnDestroy {
  private gameId!: number;
  private subscriptions: Subscription[] = [];

  pusherChannel: any;
  players: any[] = [];
  pusherIdToUserNameMap = new Map<string, string>();
  user: User;

  isActive: boolean = false;

  constructor(
    private accountService: AccountService
  ) {
    this.user = this.accountService.userValue;
    this.pusherIdToUserNameMap.set(this.user.id, this.user.username);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  // initialise Pusher and bind to presence channel
  initPusher(): CreateGameComponent {

    // init pusher
    const pusher = new Pusher('cd3b623ce769e9f6154f', {
      authEndpoint: 'http://localhost:3000/pusher/auth',
      cluster: 'us2',
    });

    // bind to relevant Pusher presence channel
    this.pusherChannel = pusher.subscribe("presence-chat-" + this.gameId);

    return this;
  }
