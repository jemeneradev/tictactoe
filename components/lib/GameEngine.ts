import { uniq, compact } from 'lodash'
import { stringify } from 'querystring'

type GameMove = 'x' | 'o' | '_'
type GameData = [
  GameMove,
  GameMove,
  GameMove,
  GameMove,
  GameMove,
  GameMove,
  GameMove,
  GameMove,
  GameMove
]

type moveFunc = (data:string,piece:number) => ["x"|"o", number];
type saveFunc = (data:string) => void;
type prePlayFunc = (nextPlayer:string) => void;
type player = {avatar:string, move:moveFunc, save: saveFunc}|null;

class Game {
  players: player[]
  public currentPlayer:number
  prePlay :prePlayFunc
  constructor () {
    this.players = []
    this.currentPlayer = 0
  }

  addPlayer(pl:player){
    if(this.players!==null){
      this.players.push(pl)
    }
  }

  setUpPrePlay(prePlayFunc: prePlayFunc){
    this.prePlay = prePlayFunc
  }

  public InsertMove (data:string,move: 'x' | 'o', place: number): string {
    //console.log(this.data[0], typeof this.data)
    if (place >= 0 && place < 9) {
      /* this.data[place] = move */
      let temp = data.split("")
      temp[place] = move
      console.log("move",temp)
      return temp.join("")
    }
    return ""
  }

  async allowNextPlay(data,piece,currentPlayerAvatar){
    const game = this
    const myturn : player = game.players.find(p=>{
      return p.avatar === currentPlayerAvatar
    });
    console.log('current player', myturn);
    const nextPlay = await myturn.move(data,piece)
    const [avatar,chosenPiece] = nextPlay
    console.log("myplay:",nextPlay)
    //this.InsertMove(data,avatar,chosenPiece)
    myturn.save(game.InsertMove(data,avatar,chosenPiece))
    game.prePlay(currentPlayerAvatar==="x"?"o":"x")
    return nextPlay
  }

  static toGameData = (data:string) => {
    const response = data.filter(e => {return e==="x" || e==="o" || e==="_"})
    if(response.length === 9){
      return response
    }
    return Game.EmptySet()
  }

  static EmptySet = (): GameData => {
    return ['_', '_', '_', '_', '_', '_', '_', '_', '_']
  } 

  static DetermineWinner(data: GameData) {
    const winningPositions = [
      [0, 3, 6], //0 |
      [1, 4, 7], //1 Vertical Solutions
      [2, 5, 8], //2 |
      [0, 1, 2], //3 -
      [3, 4, 5], //4 Horizontal Solutions
      [6, 7, 8], //5 -
      [0, 4, 8], //6 \
      [2, 4, 6] //7 /
    ]

    const winner = compact(
      winningPositions.map(pos => {
        let ar = uniq([data[pos[0]], data[pos[1]], data[pos[2]]])
        return ar.length === 1 && ar[0] !== '_' ? ar[0] : null
      })
    )

    return winner.length > 0 ? winner[0] : null
  }

  /**
   * returns the indices where the given move value are located.
   */
  static MoveSet (move: GameMove, data: GameMove[]): number[] {
    let chosen: number[] = []
    data.forEach((x, i) => {
      if (x === move) {
        chosen.push(i)
      }
    })
    return chosen
  }

  /**
   * shortcut for MoveSet('_')
   */
  static SpotsRemaining (data: GameMove[]): number[] {
    return Game.MoveSet('_', data)
  }
}

export default Game
