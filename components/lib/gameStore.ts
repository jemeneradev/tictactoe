import {atom, selector,useRecoilState} from 'recoil'
import {Decide} from './Cpu'
import Game from "./GameEngine"
import {playerAvatarAtom} from './playersStore'

const triggerPlayerPlay = ({onSet,getPromise})=>{
    onSet(async (newPiece)=>{
        const currentGame = await getPromise(currentGameAtom)
        const data = await getPromise(tictactoeAtom)
        const currentPlayer = await getPromise(currentPlayerAtom)
        const playerAvatar = await getPromise(playerAvatarAtom)
        if(currentPlayer===playerAvatar) currentGame.allowNextPlay(data,newPiece,currentPlayer)
    })
}

const triggerOpponentPlay = ({onSet,getPromise})=>{
    onSet(async (newPiece)=>{
        const currentGame = await getPromise(currentGameAtom)
        const data = await getPromise(tictactoeAtom)
        const currentPlayer = await getPromise(currentPlayerAtom)
        const playerAvatar = await getPromise(playerAvatarAtom)
        if(currentPlayer!==playerAvatar) currentGame.allowNextPlay(data,newPiece,currentPlayer)
    })
}

type turn = "x" | "o";
export const currentPlayerAtom = atom<turn>({
    key:"currentPlayer",
    default:"x",
    effects:[triggerOpponentPlay]
})

export const tictactoeAtom = atom<string>({
    key:"tictactoe",
    default:""
})
export const currentGameAtom = atom<Game>({
    key: "currentGame",
    default: null
    
})

export const currentPieceAtom = atom<number>({
    key:"currentPiece",
    default:-1,
    effects:[triggerPlayerPlay]
}) 