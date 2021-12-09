// react, react-native
import React, { useState } from 'react'
import { View, ScrollView, Text, TextInput, Button } from 'react-native'
// react-navigation
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
// styles, widgets, logic
import { styles } from './styles'
import { SimpleList } from './widgets/SimpleList'
import { Profile } from './logic/types'
import { Mode } from './logic/modes'
import { Converter } from './logic/core'


type NavigationConfig = {
    Home: undefined,
    Input: { profile: Profile },
    Adjust: { profile: Profile, input: string }
}

let Home = (props: NativeStackScreenProps<NavigationConfig, 'Home'>) => {
    let mainMenu = Object.values(Mode).map(mode => ({
        profile: mode,
        title: mode.name
    }))
    return (
        <SimpleList style={{ flex: 1 }} data={mainMenu} onItemClick={
            (item) => props.navigation.navigate('Input', { profile: item.profile })
        }>
            { (item) =>
                <Text style={{'color': 'hsl(0, 0%, 35%)','fontSize': 21}}>{ item.title }</Text>
            }
        </SimpleList>
    );
}

let Input = (props: NativeStackScreenProps<NavigationConfig, 'Input'>) => {
    let {profile} = props.route.params
    let [input, setInput] = useState('')
    let adjust = () => {
        props.navigation.navigate('Adjust', { profile, input })
    }
    return (
        <ScrollView style={{ flex: 1 }}>
            <Text style={styles.title}>{ profile.name }</Text>
            <TextInput
                multiline
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="在這裡輸入原文"
            />
            <Button onPress={adjust} title="OK" />
        </ScrollView>
    )
}

let Adjust = (props: NativeStackScreenProps<NavigationConfig, 'Adjust'>) => {
    let {profile, input} = props.route.params
    let [converter] = useState(() => new Converter(profile, input))
    let seq = Array.from((function* () {
        let n = converter.MultiValuesCount()
        for (let i = 0; i < n; i += 1) { yield i }
    })())
    return (
        <ScrollView style={{ flex: 1 }}>
            { seq.map((index) => (
                <AdjustItem converter={converter} index={index} key={index} />
            )) }
        </ScrollView>
    )
}
let AdjustItem = (props: { converter: Converter, index: number }) => {
    let [left,focus,right] = props.converter.MultiValueNeighborhood(props.index)
    let options = props.converter.MultiValueOptions(props.index)
    let tip = props.converter.MultiValueTip(props.index)
    let current = props.converter.MultiValueCurrentOverride(props.index)
    return (
        <View>
            <Text>
                <Text>……{left}</Text>
                <Text style={{fontWeight:'bold',fontSize:20}}>{focus}</Text>
                <Text>{right}……</Text>
            </Text>
            <View>
                { options.map(([val,desc]) => (
                    <View key={val}>
                        <Text style={{fontSize:20}}>{val}</Text>
                        <Text>{desc}</Text>
                    </View>
                )) }
            </View>
            <Text>{tip}</Text>
        </View>
    )
}

let Stack = createNativeStackNavigator<NavigationConfig>()
let App = () => {
    return (<NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home}></Stack.Screen>
            <Stack.Screen name="Input" component={Input}></Stack.Screen>
            <Stack.Screen name="Adjust" component={Adjust}></Stack.Screen>
        </Stack.Navigator>
    </NavigationContainer>)
}

export default App


