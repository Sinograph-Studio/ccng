import React from 'react'
import {Text,TouchableNativeFeedback,Linking} from 'react-native'
import {styles} from '../styles'

export function P(props: { children: string }): JSX.Element {
    return <Text style={styles.p}>{props.children}</Text>
}
export function A(props: { href: string, children: string }): JSX.Element {
    return <TouchableNativeFeedback onPress={() => { (async () => {
        let url = props.href
        if (await Linking.canOpenURL(url)) {
            Linking.openURL(url)
        }
    })() }} >
        <Text style={styles.a}>{props.children}</Text>
    </TouchableNativeFeedback>
}
export function Title(props: { children: string }): JSX.Element {
    return <Text style={styles.title}>{props.children}</Text>
}
export function SmallTitle(props: { children: string }): JSX.Element {
    return <Text style={styles.smallTitle}>{props.children}</Text>
}
export function Sep(): JSX.Element {
    return <Text style={styles.sep}></Text>
}


