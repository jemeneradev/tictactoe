import { useRecoilState } from "recoil";
import {playerAvatarAtom,opponentSelector} from "./lib/playersStore"
import Mark from "./Mark"

export default function NewGame(props) {
    const [playerChoice, setPlayerChoice] = useRecoilState(playerAvatarAtom);
    const [, setOpponentChoice] = useRecoilState(opponentSelector)
    const onChoiceChange = ({target}) => {
        console.log(target.value);
        setPlayerChoice(target.value)
    }
    return (
    <article className="NewGame">
       <figure className="Logo">
                <Mark value="x" xradius="10"/>
                <Mark value="o"/> 
        </figure>
        <section className="PlayerOptions theme-dark">
            <h1>PICK PLAYER 1’S MARK</h1>
            {/* {props.checked} */}
            <ul>
                <li>
                    <fieldset className={`${playerChoice==="x"? "playerChoice_Selected":"playerChoice_NotSelected"}`}>
                        <label htmlFor="player_choice_x">
                            <Mark value="x" xradius="6"/> 
                        </label>
                        <input name="player_choice" id="player_choice_x" type="radio" value="x" defaultChecked onChange={onChoiceChange}></input>
                    </fieldset>
                </li>
                <li>
                    <fieldset className={`${playerChoice==="o"? "playerChoice_Selected":"playerChoice_NotSelected"}`}>    
                        <label htmlFor="player_choice_o" className="newgame_left">
                            <Mark value="o"/> 
                        </label>
                        <input name="player_choice" id="player_choice_o" type="radio" value="o" onChange={onChoiceChange}></input>
                    </fieldset>
                </li>
            </ul>
            <h2>REMEMBER : X GOES FIRST</h2>
        </section>
        <fieldset className="GameOptions">
            <button className="theme-yellow" onClick={()=>setOpponentChoice("cpu")}>NEW GAME (VS CPU)</button>
            <button className="theme-blue btn-player" onClick={()=>setOpponentChoice("human")}>NEW GAME (VS PLAYER)</button> 
        </fieldset>
    </article>
    )
}