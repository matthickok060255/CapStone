import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Game } from "../domainObjects/game";
import { ServicesUtils } from "../Utils/services-utils";
import { catchError, retry } from 'rxjs/operators';
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root"
  })
export class CreateGameService {
  private REST_API_SERVER = "http://localhost:8080/api";

  constructor(private httpClient: HttpClient) { }


  /**
   * Gets all of the current games that can be joined
   * @returns Observable<Game>
   */
  createGame(game: Game): Observable<Game> {

    let params = new HttpParams();
    params = params.append('name', game.name);
    params = params.append('password', game.password);
    params = params.append('maxPlayers', game.maxPlayers);
    params = params.append('minPlayers', game.minPlayers);
    params = params.append('numWerewolfPlayers', game.numWerewolfPlayers);
    params = params.append('isPsychics', game.psychic);
    params = params.append('isReporter', game.reporter);
    params = params.append('isCop', game.cop);
    params = params.append('roundTimer', game.roundTimer);
    params = params.append('gameState', "CREATED");
    params = params.append('createdBy', game.createdBy);

    return this.httpClient.post<Game>(this.REST_API_SERVER + "/createGame", params)
    .pipe(catchError(ServicesUtils.handleError));
  }

   /**
   * Gets all of the current games that can be joined
   * @returns Observable<Game>
   */
    getGamebyId(id: number): Observable<Game> {
      return this.httpClient.get<Game>(this.REST_API_SERVER + "/games/" + id)
      .pipe(catchError(ServicesUtils.handleError));
    }

     /**
   * Gets all of the current games that can be joined
   * @returns Observable<Game>
   */
  updateGame(game: Game): Observable<Game> {


    return this.httpClient.put<Game>(this.REST_API_SERVER + "/games/" + game.id, game)
    .pipe(catchError(ServicesUtils.handleError));
  }

}
