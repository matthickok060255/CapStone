import { gameState } from "./gameStateEnum";

export class Game {
    public id!: number
    public name: string;
    public password: string;
    public maxPlayers: number;
    public minPlayers: number;
    public currentPlayers: number;
    public numWerewolfPlayers: number;
    public psychic: boolean;
    public reporter: boolean;
    public cop: boolean;
    public startTime: Date;
    public roundTimer: number;
    public gameState: gameState;

    constructor(
        name: string,
        maxPLayers: number,
        minPlayers: number,
        currentPlayers: number,
        numWerewolfPlayers: number,
        psychic: boolean,
        reporter: boolean,
        cop: boolean,
        password: string,
        startTime: Date,
        roundTimer: number,
        gameState: gameState) {
            this.name = name;
            this.maxPlayers = maxPLayers;
            this.minPlayers = minPlayers;
            this.currentPlayers = currentPlayers
            this.password = password;
            this.numWerewolfPlayers = numWerewolfPlayers;
            this.psychic = psychic;
            this.reporter = reporter;
            this.cop = cop;
            this.startTime = startTime;
            this.roundTimer = roundTimer;
            this.gameState = gameState;
    }
  }
