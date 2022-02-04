import { useRecoilState, useRecoilValue,useRecoilCallback } from "recoil"
import Dialog from "./Dialog"
import Mark from "./Mark"
import {opponentSelector, playerAvatarAtom} from './lib/playersStore'
import {tictactoeAtom,currentGameAtom, currentPieceAtom,currentPlayerAtom} from './lib/gameStore'
import { useEffect,useMemo } from "react"
import Game from './lib/GameEngine'
import {DecideNextMove} from './lib/Cpu'
//import "./css/board.scss"



export default function GameBoard(props) {
    const avatar = useRecoilValue(playerAvatarAtom)
    const [data, setData] = useRecoilState(tictactoeAtom)
    const [,setChosenPiece] = useRecoilState(currentPieceAtom)
    const [,setCurrentGame] = useRecoilState(currentGameAtom)
    const [currentPlayer,setCurrentPlayer] = useRecoilState(currentPlayerAtom)
    
    const inverseColors = false
    useEffect(()=>{
        setData("_________")
        setCurrentGame(cur => {
            const currentGame = new Game()
            const opponent = avatar==="x"? "o":"x"
            currentGame.addPlayer({
                avatar,
                move:function(gd:string,piece:number){
                    return [this.avatar,piece]//chosenPiece
                },
                save: function(newData){
                    setData(newData)
                }
            })
            
            currentGame.addPlayer({
                avatar: opponent,
                move: function(gd:string,piece:number){
                    //const mymove = DecideNextMove(this.avatar,gd)
                    return [this.avatar, 5]
                },
                save: function(newData){
                    setData(newData)
                }
            })
            currentGame.setUpPrePlay((nextPlayer: "x"|"o")=>{
                console.log("setup next player")
                setCurrentPlayer(nextPlayer)
            })

            console.log(currentGame)
            return currentGame 
        })
    },[])

    const handleClick = (kindex:0|1|2|3|4|5|6|7|8) => {
        //console.log(kindex)
        setChosenPiece(kindex)
    }
    const pads = data.split("").map((val,i)=>{
        const padColor = inverseColors ? (val==="o" ? "Pad--selectedO" : val==="x"? "Pad--selectedX":""):""
        return (
            <li className={`Pad ${padColor}`} key={`${val}-${i}`} onClick={()=>handleClick(i)}>   
                {(val==="o" || val==="x") ?      
                    (<div className={`GamePiece ${val==="o" ? "oPiece" : val==="x"? "xPiece":""}`}>
                        <Mark value={val} xradius="5" useTheme inverse={inverseColors}/>
                    </div>)
                    :null
                }
            </li> 
        )
    })

    return (
    <article className="Board">
        <header className="Menu">
            <figure className="Logo">
                <Mark value="x" xradius="10"/>
                <Mark value="o"/> 
            </figure>
            <label className="TurnIndicator theme-dark"><div><Mark value={currentPlayer} xradius="5"/></div><strong>TURN</strong></label>
            <button className="RefreshButton theme-light">
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.5241 2.75843e-07H17.644C17.3812 -0.000279724 17.1679 0.21264 17.1676 0.47564C17.1676 0.48336 17.1678 0.49108 17.1681 0.4988L17.3268 3.78292C15.46 1.58176 12.7198 0.31428 9.83484 0.31744C4.41536 0.31748 -0.00395734 4.74324 2.65924e-06 10.1663C0.00396266 15.598 4.40584 20 9.83484 20C12.2702 20.0034 14.6195 19.0993 16.425 17.4639C16.6208 17.2885 16.6375 16.9874 16.4622 16.7915C16.4563 16.7849 16.4502 16.7785 16.444 16.7722L15.0957 15.423C14.9186 15.2459 14.6346 15.2363 14.4461 15.4012C11.5521 17.949 7.14188 17.6669 4.59564 14.7709C2.0494 11.875 2.3314 7.46188 5.22544 4.914C8.11948 2.36612 12.5297 2.64828 15.0759 5.54424C15.2755 5.77124 15.4601 6.01096 15.6287 6.26188L11.6024 6.06864C11.3398 6.05616 11.1169 6.25896 11.1044 6.52168C11.104 6.5294 11.1038 6.53712 11.1039 6.54484V8.4262C11.1039 8.6892 11.3169 8.9024 11.5798 8.9024H19.5242C19.787 8.9024 20 8.6892 20 8.4262V0.4762C20 0.2132 19.787 2.75843e-07 19.5241 2.75843e-07V2.75843e-07Z" fill="#1F3641"/>
                </svg>
            </button>
        </header>
        <ul className="Grid">
            {pads}
        </ul>
        <section className="Scores">
            <ul>
                <li className={avatar === "x" ? `theme-x-color`: `theme-o-color`}>
                    <p>X(YOU)<strong>14</strong></p>
                </li>
                <li className="theme-neutral-color">
                    <p>TIES<strong>32</strong></p>
                </li>
                <li className={avatar === "o" ? `theme-x-color`: `theme-o-color`}>
                    <p>O(CPU)<strong>11</strong></p>
                </li>
            </ul>
        </section>
        {/* <Dialog player="x" status="restart"/> */}
    </article>
    )
}