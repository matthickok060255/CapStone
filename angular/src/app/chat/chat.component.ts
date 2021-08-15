import { Component, OnInit, Input, ViewChild } from "@angular/core";
import Pusher from "pusher-js";
import { Message } from "../domainObjects/message";

@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {


  @Input() username: string = "";
  @Input() chatId: string = "";
  @ViewChild('message') message: any;

  messages: Message[] = [];

  pusherChannel: any;


  constructor() {

  }

  ngOnInit() {
    console.log("Here");
    this.initPusher();
    this.pusherChannel.bind('client-new-message', (message: Message) => {
      this.messages.push(message);
    });
  }


  // initialise Pusher and bind to presence channel
  initPusher(): ChatComponent {

    // init pusher
    const pusher = new Pusher('cd3b623ce769e9f6154f', {
      authEndpoint: 'http://localhost:3000/pusher/auth',
      cluster: 'us2',
    });

    // bind to relevant Pusher presence channel
    this.pusherChannel = pusher.subscribe("presence-chat-" + this.chatId);

    return this;
  }

  sendMessage() {
    const message: Message = {
       user: this.username,
       text: this.message.nativeElement.value,
    }
    this.pusherChannel.trigger('client-new-message', message);
    this.messages.push(message);
  }

}
