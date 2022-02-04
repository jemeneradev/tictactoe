import Board from "./Board"
import NewGame from "./NewGame"
import {useRecoilState} from 'recoil'
import {viewStateAtom} from "./lib/playersStore"

export default function TicTacToe(props) {
    const [view,] = useRecoilState(viewStateAtom)
    return (
        <div className="GameBoard theme-game-pieces">
            {view === "new" ? <NewGame/> : <Board/>}
        </div> 
    )
}