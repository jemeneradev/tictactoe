import Game from "./GameEngine";
import { intersection, union, without } from "lodash";

type GameMove = "x" | "o" | "_";
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
];
type PlayCombination = [number, number, number];

/**
 * 0 1 2
 * 3 4 5
 * 6 7 8
 */
const WinningPlayCombinations: PlayCombination[] = [
  [0, 3, 6], //0 |
  [1, 4, 7], //1 Vertical Solutions
  [2, 5, 8], //2 |
  [0, 1, 2], //3 -
  [3, 4, 5], //4 Horizontal Solutions
  [6, 7, 8], //5 -
  [0, 4, 8], //6 \
  [2, 4, 6] //7 /
];

const groupDiff = (gnum: number, values: number[]) => {
  return WinningPlayCombinations[gnum].filter((x) => values.indexOf(x) === -1);
};

/**
 * index = spots in the board
 * values in array = locations where index is located in winning combinations
 */
const WinningPlayCombinationsHash: number[][] = [
  /*0*/ [0, 3, 6],
  /*1*/ [1, 3],
  /*2*/ [2, 3, 7],
  /*3*/ [0, 4],
  /*4*/ [1, 4, 6, 7],
  /*5*/ [2, 4],
  /*6*/ [0, 5, 7],
  /*7*/ [1, 5],
  /*8*/ [2, 5, 6]
];

/**
 * returns sorted(decreasing in length) set of index,WinningPlayCombinationsHash[i]
 * ex: given the choice of [5], method would return [5,[2,4]]; The value 5 is in group 2 and 4 of the winning combinations
 */
const valueAndLocationsInWinningCombinations = (
  spots: number[]
): [number, number[]][] => {
  return spots
    .map((i) => {
      return { v: i, l: WinningPlayCombinationsHash[i].length };
    })
    .sort((prev, curr) => {
      return curr.l - prev.l;
    })
    .map((x) => {
      return [x.v, WinningPlayCombinationsHash[x.v]];
    });
};

/**
 * return member count for each winning group.
 * ex: if one has 5th position taken, winning count set would be: [ 0, 0, 1, 0, 1, 0, 0, 0, 0 ]
 */
const spotCountForEachWinnningSet = (
  index_WinningPlayCombinationsHashAtIndex: [number, number[]][]
) => {
  let x = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // WinningPlayCombinationsHash.length = 9
  index_WinningPlayCombinationsHashAtIndex.forEach((i) => {
    //i[0] = given board spot, i[1] = every winning group where index is in.
    i[1].forEach((j) => {
      //WinningPlayCombinationsHashAtIndex
      return (x[j] = x[j] + 1); // another member of group at x[j] has been found, increment count.
    });
  });
  return x;
};

const countAndGroup = (values: number[]): { [key: number]: number[] } => {
  let group: { [key: number]: number[] } = {};
  values.forEach((v, i: number) => {
    /* if(desiredCount===v) {
              group.push([i,v])
            } */
    if (!group[v]) {
      group[v] = [i];
    } else {
      group[v].push(i);
    }
  });
  return group;
};

function checkSpotAvailability(
  piece: "x" | "o",
  group: number[],
  moves: number[]
): ["x" | "o", number] | null {
  let winningSpotFound = -1;
  group.forEach((g) => {
    const winningSpotLeft = without(WinningPlayCombinations[g], ...moves);
    if (winningSpotLeft.length > 0) {
      winningSpotFound = winningSpotLeft[0];
    }
  });
  if (winningSpotFound >= 0) {
    return [piece, winningSpotFound];
  }
  return null;
}

export async function Decide(player: "x" | "o", data: string) {
  const gameData = Game.toGameData(data);
  const nextMove = await CpuNextMove("o", gameData);
  const game = new Game(gameData);
  game.InsertMove(...nextMove);
  const newData = Game.toString(game.Data);
  return newData;
}

type moveFunc = (data: string, piece: number) => ["x" | "o", number];

export const DecideNextMove = (avatar: "x" | "o", data: string): number => {
  const xos = Game.toGameData(data.split(""));
  const nextMove = CpuNextMove(avatar, <GameMove[]>xos);
  if (nextMove !== null) {
    return nextMove[1];
  }
  return -1;
};

function CpuNextMove(
  mypiece: "x" | "o",
  data: GameMove[]
): ["x" | "o", number] | null {
  let myNextMove = -1;
  //determine opponent piece
  const opponent = mypiece === "x" ? "o" : "x";
  const _spotsNotTakenYet = Game.SpotsRemaining(data);

  //check positions
  const myMoves = Game.MoveSet(mypiece, data);
  const opponentMoves = Game.MoveSet(opponent, data);
  const myAndopMoves = union(myMoves, opponentMoves);

  const myValueAndLocationsInWinningCombinations =
    valueAndLocationsInWinningCombinations(myMoves);
  const opponentValueAndLocationsInWinningCombinations =
    valueAndLocationsInWinningCombinations(opponentMoves);

  const myValuesVector = spotCountForEachWinnningSet(
    myValueAndLocationsInWinningCombinations
  );
  const opponentValuesVector = spotCountForEachWinnningSet(
    opponentValueAndLocationsInWinningCombinations
  );

  //console.log(mypiece, myMoves, myValuesVector)
  //console.log(opponent, opponentMoves, opponentValuesVector)

  //console.log(countAndGroup(myValuesVector))
  const myGroupCount = countAndGroup(myValuesVector);
  console.log(myGroupCount)
  if (myGroupCount[2]) {
    //there exist a group in which I need but 1 more member, check it
    //take it and win
    let winningSpotFound = checkSpotAvailability(
      mypiece,
      myGroupCount[2],
      myAndopMoves
    );
    if (winningSpotFound != null) {
      return winningSpotFound;
    }
    //return next position to take
  }

  //console.log(countAndGroup(opponentValuesVector))
  const opponentGroupCount = countAndGroup(opponentValuesVector);
  console.log(opponentGroupCount)
  if (opponentGroupCount[2]) {
    //there exist a group in which opponent needs but 1 more member, check it
    //block that position
    //console.log('there', opponentGroupCount)
    let blockingSpotFound = checkSpotAvailability(
      mypiece,
      opponentGroupCount[2],
      opponentMoves
    );
    if (blockingSpotFound != null) {
      return blockingSpotFound;
    }
    //return next position to take
  }

  const sharedGroups: number[] = intersection(
    myGroupCount[1],
    opponentGroupCount[1]
  );
  if (sharedGroups.length > 0) {
    //try to block opponent
    const possibleBlocks: number[] = [];
    sharedGroups.forEach((g) => {
      let groupMembersMinusOurTakenGroupMoves = without(
        WinningPlayCombinations[g],
        ...myAndopMoves
      );
      if (groupMembersMinusOurTakenGroupMoves.length > 0) {
        console.log(groupMembersMinusOurTakenGroupMoves[0]);
        possibleBlocks.push(groupMembersMinusOurTakenGroupMoves[0]);
      }
    });
    if (possibleBlocks.length > 0) {
      return [mypiece, possibleBlocks[0]];
    }
  } else {
      return [mypiece,0]
  }

  

  return null;
}

export default CpuNextMove;
