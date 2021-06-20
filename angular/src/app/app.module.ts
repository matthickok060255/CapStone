import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ActiveGameComponent } from './active-game/active-game.component';
import { AngularMaterialModule } from './material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateGameComponent } from './create-game/create-game.component';
import { GameLobbyComponent } from './gameLobby/game-lobby.component';
import { NaviationBarComponent } from './navigation-bar/navigation-bar.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ActiveGameComponent,
    CreateGameComponent,
    GameLobbyComponent,
    NaviationBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
