import TicTacToe from "./TicTacToe"
import { RecoilRoot } from 'recoil'
export default function App(props) {
    return (
        <RecoilRoot>
            <TicTacToe />
        </RecoilRoot>        
    )
}