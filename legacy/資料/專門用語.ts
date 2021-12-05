import {專門用語} from './專門用語/types'
import {人名} from './專門用語/人名'
import {地名} from './專門用語/地名'
import {單位} from './專門用語/單位'
import {數學} from './專門用語/數學'
import {物理} from './專門用語/物理'
import {化學} from './專門用語/化學'
import {電腦} from './專門用語/電腦'

export const 專門用語表: { [類別:string]: 專門用語[] } = {
    人名, 地名, 單位,
    數學, 物理, 化學, 電腦
}


