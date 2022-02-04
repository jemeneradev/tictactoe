//import "./css/dialog.scss"
import Mark from "./Mark"
export default function Dialog(props:{status:"won"|"lost"|"tie"|"restart", player: "x"|"o"}) {
    let outcome = props.status === "won" ? <strong>You Won!</strong>:<strong>Oh no, You Lost<span>...</span></strong>
    let winner: "x"|"o" = props.status === "won" && props.player === "x" ? "x":"o" 
    
    const quitNextButtons = (
        <ul>
            <li><button className="theme-light __quit">Quit</button></li>
            <li><button className="theme-yellow __next">Next Round</button></li>
        </ul>
    )
    const cancelRestartButtons = (
        <ul className="--RestartOrTie">
            <li><button className="theme-light __cancel">No, Cancel</button></li>
            <li><button className="theme-yellow __restart">Yes, Restart</button></li>
        </ul>
    )
    const lostOrWon = (
        <>
            <header className={`${winner === "x" ? "theme-blue" : "theme-yellow"}`}>
                <Mark value={winner} />
                <h1>Takes the round</h1>
            </header>
            <p className="theme-light">{outcome}</p>
            {quitNextButtons}
        </>
    )
    const restart = (
        <>
            <header className="--RestartOrTie">
                {props.status==="restart" ? <h1>Restart Game?</h1> : <h1>Round Tied</h1>}
            </header>
            {props.status==="restart" ? cancelRestartButtons : quitNextButtons}
        </>
    )
    return (
        <section className="Dialog theme-dark">
            {props.status === "lost" || props.status === "won" ? lostOrWon : restart}
        </section>
    )
}
