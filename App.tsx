import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SimpleList } from './widgets/SimpleList'

let Home = () => {
    let mainMenu = [
        { name: "s2t", title: "S to T" },
        { name: "t2s", title: "T to S" },
        { name: "s2j", title: "S to J" }
    ]
    return (
        <View style={{ flex: 1 }}>
            <SimpleList data={mainMenu} onItemClick={() => void 0}>
                { (item) =>
                    <Text style={{'color': 'hsl(0, 0%, 35%)','fontSize': 21}}>{ item.title }</Text>
                }
            </SimpleList>
        </View>
    );
}

let Stack = createNativeStackNavigator()
let App = () => {
    return (<NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home}></Stack.Screen>
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


