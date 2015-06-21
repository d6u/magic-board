const playersRef = new Firebase('https://glowing-torch-4886.firebaseio.com/players');

class PlayersStore {

  constructor() {
    this.eventHandlers = new Map();
  }

  /**
   * Create a player data point
   * @return {object} {id: string, player: Firebase}
   */
  createPlayer() {
    let player = playersRef.push();
    let parts = player.toString().split('/');
    let id = parts[parts.length - 1];
    return { id, player };
  }

  /**
   * Fetch a player data according to provided id
   * @param  {string}  id
   * @return {Promise} Resolve with reference of the player endpoint
   *                   Reject if cannot find
   */
  getPlayer(id) {
    // return new Promise(res => {
    //   let player = playersRef.push();
    //   res(player.toString());
    // });
  }

}

export default new GameStore();
