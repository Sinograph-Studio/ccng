import React from 'react'
import {Text,StyleProp,TextProps} from 'react-native'
import {styles} from '../styles'

export function P(props: { styles?: StyleProp<TextProps>, children: string }): JSX.Element {
    return <Text style={styles.p}>{props.children}</Text>
}
export function Title(props: { styles?: StyleProp<TextProps>, children: string }): JSX.Element {
    return <Text style={styles.title}>{props.children}</Text>
}
export function SmallTitle(props: { styles?: StyleProp<TextProps>, children: string }): JSX.Element {
    return <Text style={styles.smallTitle}>{props.children}</Text>
}


