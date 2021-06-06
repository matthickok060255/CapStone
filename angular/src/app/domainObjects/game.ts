export class Game {
    public uuid: String
    public name: String;
    public password: String;
    public maxPLayers: number;
    public minPlayers: number;
    public numWerewolfPlayers: number;
    public isPhysic: boolean;
    public isReporter: boolean;
    public isCop: boolean;
    public startTime: Date;
    public roundTimer: number;

    constructor(
        name: String,
        maxPLayers: number,
        minPlayers: number,
        numWerewolfPlayers: number,
        isPhysic: boolean,
        isReporter: boolean,
        isCop: boolean,
        password: String,
        startTime: Date,
        roundTimer: number,) {
            this.uuid = "random";
            this.name = name;
            this.maxPLayers = maxPLayers;
            this.minPlayers = minPlayers;
            this.password = password;
            this.numWerewolfPlayers = numWerewolfPlayers;
            this.isPhysic = isPhysic;
            this.isReporter = isReporter;
            this.isCop = isCop;
            this.startTime = startTime;
            this.roundTimer = roundTimer;
    }
  }
