import {atom, selector} from 'recoil'

type avatar = 'x' | 'o'
export const playerAvatarAtom = atom<avatar>({
    key:"playerAvatar",
    default: "x"
})

type views = 'new' | 'board' 
export const viewStateAtom = atom<views>({
    key:"views",
    default: "new"
})

type opponentOption = "cpu" | "human" | null
const opponentAtom = atom<opponentOption>({
    key:"opponentChoice",
    default: null
})

export const opponentSelector = selector<opponentOption>({
    key:"opponentSelector",
    get: ({get}) =>{
        return get(opponentAtom)
    },
    set: ({set}, nValue) => {
        if (nValue !== null) {
           set(opponentAtom,nValue)
           set(viewStateAtom,"board")
        }
    } 
})

