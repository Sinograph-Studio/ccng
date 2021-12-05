import React from 'react'
import { View } from 'react-native'


let SeparatorStyle = {
    'height': 1,
    'width': '100%',
    'backgroundColor': 'hsla(0, 0%, 75%, 0.7)'
}

export default function Separator(props) {
    return <View style={SeparatorStyle}></View>
}


