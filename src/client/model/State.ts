import * as funcs from '../../lib/funcs';
import {ME, OPPONENT, RESULT_TIE} from "@socialgorithm/ultimate-ttt/dist/model/constants";

/**
 * Game stats calculated from a given state
 */
export interface Stats {
  winner?: number;
  total?: number;
  max?: number;
  avg?: number;
  min?: number;
  winPercentages?: Array<string>;
  tiePercentage?: string;
}

/**
 * Games State holder
 * Used to track the state across multiple games between two players
 */
export default class State {
  public games: number;
  public ties: number;
  public wins: Array<number>;
  public times: Array<number>;
  public timeouts: Array<number>;

  constructor() {
    this.games = 0;
    this.ties = 0;
    this.wins = [0, 0];
    this.times = [];
    this.timeouts = [0, 0];
  }

  /**
   * Prints the current state to the console
   */
  public printState(){
    const stats = this.getStats();

    let winner = null;
    if (stats.winner === ME) {
      winner = 'A';
    } else if(stats.winner === OPPONENT) {
      winner = 'B';
    }

    console.log('');
    if (winner) {
      console.log('Winner: Player %s', winner);
    } else {
      console.log('Tie!');
    }
    console.log('Games played: %d', this.games);
    console.log('');
    console.log('Player A wins: %d (%s)', this.wins[ME], stats.winPercentages[ME]);
    console.log('Player B wins: %d (%s)', this.wins[OPPONENT], stats.winPercentages[OPPONENT]);
    console.log('Ties: %d (%s)', this.ties, stats.tiePercentage);
    console.log('');
    console.log('Player A timeouts: %d', this.timeouts[ME]);
    console.log('Player B timeouts: %d', this.timeouts[OPPONENT]);
    console.log('');
    console.log('Total time: %dms', stats.total);
    console.log('Avg game: %dms', stats.avg);
    console.log('Max game: %dms', stats.max);
    console.log('Min game: %dms', stats.min);
    return true;
  }

  /**
   * Get some useful stats from the current game state
   * @returns {Stats}
   */
  public getStats(): Stats {
    const stats: Stats = {};
    // Get winner
    if (this.wins[ME] === this.wins[OPPONENT]) {
      stats.winner = RESULT_TIE;
    } else if(this.wins[ME] > this.wins[OPPONENT]) {
      stats.winner = ME;
    } else {
      stats.winner = OPPONENT;
    }

    stats.winPercentages = [
      funcs.getPercentage(this.wins[ME], this.games),
      funcs.getPercentage(this.wins[OPPONENT], this.games)
    ];

    stats.tiePercentage = funcs.getPercentage(this.ties, this.games);

    // Get avg exec time
    let sum = 0;
    stats.total = 0;
    stats.max = 0;
    stats.avg = 0;
    stats.min = 1000;

    if(this.times.length > 0){
      for(let i = 0; i < this.times.length; i++ ){
        stats.total += this.times[i];
        sum += this.times[i];
        stats.max = Math.max(stats.max, this.times[i]);
        stats.min = Math.min(stats.min, this.times[i]);
      }
      stats.avg = funcs.round(sum/this.times.length);
      stats.total = funcs.round(stats.total);
      stats.max = funcs.round(stats.max);
      stats.min = funcs.round(stats.min);
      stats.avg = funcs.round(stats.avg);
    }

    return stats;
  }
}