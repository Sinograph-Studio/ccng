import React from 'react'
import { View, TouchableHighlight, TouchableNativeFeedback, Platform } from 'react-native'


let ItemUnderlay = 'hsla(0, 0%, 85%, 0.4)'
let ItemViewStyle = {
    'paddingTop': 10,
    'paddingBottom': 10,
    'paddingLeft': 16,
    'paddingRight': 16
}

export default function Item (props) {
    if (Platform.OS == 'android') {
        return (
            <TouchableNativeFeedback onPress={props.onClick} >
                <View style={ItemViewStyle}>
                    { props.children }
                </View>
            </TouchableNativeFeedback>
        )
    }
    return (
        <TouchableHighlight onPress={props.onClick} underlayColor={ItemUnderlay} >
            { props.children }
        </TouchableHighlight>
    )
}


