import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ActiveGameComponent } from './active-game/active-game.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateGameComponent } from './create-game/create-game.component';
import { GameLobbyComponent } from './gameLobby/game-lobby.component';

@NgModule({
  declarations: [
    AppComponent,
    ActiveGameComponent,
    CreateGameComponent,
    GameLobbyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
