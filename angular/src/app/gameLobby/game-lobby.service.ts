import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Game } from "../domainObjects/game";
import { ServicesUtils } from "../Utils/services-utils";
import { catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: "root"
  })
export class GameLobbyService {
  private REST_API_SERVER = "http://localhost:8080/api";

  constructor(private httpClient: HttpClient) { }


  /**
   * Gets all of the current games that can be joined
   * @returns Observable<Game>
   */
  getGames(): Observable<Game[]> {
    return this.httpClient.get<Game[]>(this.REST_API_SERVER + "/allCreatedGames")
    .pipe(catchError(ServicesUtils.handleError));
  }

}
