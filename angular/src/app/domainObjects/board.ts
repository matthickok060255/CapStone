import { Player } from './player'
    export class Board {
      player!: Player;
      tiles!: any;

      constructor(values: Object = {}) {
        Object.assign(this, values);
      }
    }
