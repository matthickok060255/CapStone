import { ActiveGameComponent } from './active-game/active-game.component';
import { GameLobbyComponent } from './gameLobby/game-lobby.component';
import { CreateGameComponent } from './create-game/create-game.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'gameLobby', pathMatch: 'full'},
  { path: 'createGame/:id', component: CreateGameComponent },
  { path: 'gameLobby', component: GameLobbyComponent },
  { path: 'activeGame/:id', component: ActiveGameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
