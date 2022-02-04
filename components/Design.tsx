import style from '../styles/Design.module.css'
import Image from 'next/image'
export default function Design({display,opaque}) {
    
   /*  const sizes = [
        {name:"mobile", val: 327},
        {name:"table", val: 768},
        {name:"desktop", val: 920},
        {name:"system", val: 1440}
    ] */
    //let srcSets= (sizes.map(size => display[size.name] ? `/images/design-${size.name}.svg ${size.val}w`:"")).filter(val => val).join(",\n")

    return (
        <div className={style.svgImage} style={{opacity:(opaque? 0.5 : 1), width:"375px", height:"667px"}}>
         <Image
            src={`/images/${display}.svg`}
            alt={"design"}
            layout='fill'
            />
        </div>
    )
}