// react, react-native
import React from 'react'
import { StyleSheet, Text, ScrollView } from 'react-native'
// react-navigation
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
// widgets, logic
import { SimpleList } from './widgets/SimpleList'
import { Profile } from './logic/types'
import { Mode } from './logic/modes'


type NavigationConfig = {
    Home: undefined,
    Convert: { profile: Profile }
}

let Home = (props: NativeStackScreenProps<NavigationConfig, 'Home'>) => {
    let mainMenu = Object.values(Mode).map(mode => ({
        profile: mode,
        title: mode.name
    }))
    return (
        <SimpleList style={{ flex: 1 }} data={mainMenu} onItemClick={
            (item) => props.navigation.navigate('Convert', { profile: item.profile })
        }>
            { (item) =>
                <Text style={{'color': 'hsl(0, 0%, 35%)','fontSize': 21}}>{ item.title }</Text>
            }
        </SimpleList>
    );
}

let Convert = (props: NativeStackScreenProps<NavigationConfig, 'Convert'>) => {
    let profile = props.route.params.profile
    return (
        <ScrollView style={{ flex: 1 }}>
            <Text>{ profile.name }</Text>
            <Text>1-to-1: { Object.keys(profile.mappingCharSingle).length }</Text>
            <Text>{ JSON.stringify(profile.mappingCharMulti) }</Text>
        </ScrollView>
    )
}

let Stack = createNativeStackNavigator<NavigationConfig>()
let App = () => {
    return (<NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home}></Stack.Screen>
            <Stack.Screen name="Convert" component={Convert}></Stack.Screen>
        </Stack.Navigator>
    </NavigationContainer>)
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
})

export default App


