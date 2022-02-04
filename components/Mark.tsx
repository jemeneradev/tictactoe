import style from "../styles/xo.module.scss"
type XO = "x" | "o";
export default function Mark(props: { value: XO, xradius?: string, useTheme?:boolean, inverse?:boolean}) {
    const cross_radius = props.xradius ? props.xradius : "7"
    const circle = (
        <g>
            <mask id="innerCircle"><rect x="0" y="0" width="100%" height="100%" fill="white" />
                <circle  cx="50%" cy="50%" r="20%"/>
            </mask>
            <circle cx="50" cy="50" r="50" mask="url(#innerCircle)" fill="currentColor"/>
        </g>
    )
    const cross = (
        <g>
            <rect x="-7.4%" y="34%" rx={cross_radius} width="116%" height="31%" fill="currentColor" transform="rotate(45 50 50)"/>
            <rect x="-8.5%" y="34%" rx={cross_radius} width="116%" height="31%" fill="currentColor" transform="rotate(135 50 50)"/>
        </g>
    )
    let colorStyle = props.useTheme? props.value === "x" ? `cross`:`circle` : ""
    colorStyle += props.inverse? "-inverse": ""
    return ( 
        <svg className={`shape ${colorStyle}`} viewBox="0 0 100 100"> 
            {props.value === 'o' ? circle : cross}
        </svg>     
    )
}
