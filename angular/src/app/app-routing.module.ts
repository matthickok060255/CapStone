import { ActiveGameComponent } from './active-game/active-game.component';
import { GameLobbyComponent } from './gameLobby/game-lobby.component';
import { CreateGameComponent } from './create-game/create-game.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './account/auth.guard';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);

const routes: Routes = [
  {path: '', redirectTo: 'gameLobby', pathMatch: 'full'},
  { path: 'createGame/:id', component: CreateGameComponent, canActivate: [AuthGuard] },
  { path: 'createGame', component: CreateGameComponent, canActivate: [AuthGuard] },
  { path: 'gameLobby', component: GameLobbyComponent,  canActivate: [AuthGuard] },
  { path: 'activeGame/:id', component: ActiveGameComponent,  canActivate: [AuthGuard]  },
  { path: 'activeGame', component: ActiveGameComponent,  canActivate: [AuthGuard]  },
  { path: 'account', loadChildren: accountModule },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
