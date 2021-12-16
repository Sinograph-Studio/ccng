// react, react-native
import React, { useState, useCallback } from 'react'
import { BackHandler, Alert, View, ScrollView, Text, TextInput, Button, TouchableNativeFeedback } from 'react-native'
// react-navigation
import { NavigationContainer, useFocusEffect } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackScreenProps, NativeStackNavigationOptions } from '@react-navigation/native-stack'
// styles, widgets, logic
import { styles } from './styles'
import { SimpleList } from './widgets/SimpleList'
import { Profile } from './logic/types'
import { Mode } from './logic/modes'
import { Converter } from './logic/core'
import { WithCustomConfig } from './logic/custom'


type NavigationConfig = {
    Home: undefined,
    Input: { profile: Profile },
    Adjust: { profile: Profile, input: string },
    Output: { output: string }
}

let Home = (props: NativeStackScreenProps<NavigationConfig, 'Home'>) => {
    let [customConfig, setCustomConfig] = useState('')
    let menuItem = (profile: Profile) => ({ profile, title: profile.name })
    let mainMenu = [
        menuItem(WithCustomConfig(Mode.s2t, customConfig, { reverse: true })),
        menuItem(WithCustomConfig(Mode.t2s, customConfig, {})),
        menuItem(Mode.s2j)
    ]
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
            <View style={styles.input}>
                <Text style={styles.title}>{ profile.name }</Text>
                <TextInput
                    multiline
                    style={styles.inputTextInput}
                    value={input}
                    onChangeText={setInput}
                    placeholder="在這裡輸入原文"
                />
                <View style={styles.inputButtonWrapper}>
                    <Button onPress={adjust} title="OK" />
                </View>
            </View>
        </ScrollView>
    )
}

let Adjust = (props: NativeStackScreenProps<NavigationConfig, 'Adjust'>) => {
    let {profile, input} = props.route.params
    let [converter] = useState(() => new Converter(profile, input))
    let total = converter.MultiValuesCount()
    let [confirmed,setConfirmed] = useState(0)
    let confirm = (p: boolean) => {
        if (p) {
            setConfirmed(n => (n + 1))
        } else {
            setConfirmed(n => (n - 1))
        }
    }
    let next = () => {
        props.navigation.navigate('Output', { output: converter.Output() })
    }
    useFocusEffect(useCallback(() => {
        let h = BackHandler.addEventListener('hardwareBackPress', () => {
            if (confirmed > 0) {
                Alert.alert('誤操作防止', '返回前一頁將會丢棄目前的調整。確認返回？', [
                    { text: '取消', style: 'cancel', onPress: () => (void 0) },
                    { text: '返回並丢棄', style: 'destructive', onPress: () => {
                        props.navigation.goBack()
                    } }
                ])
                return true
            } else {
                return false
            }
        })
        return () => { h.remove() }
    }, [props.navigation, confirmed]))
    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.adjust}>
                { Array.from((function* () {
                    for (let i = 0; i < total; i += 1) { yield i }
                })()).map((index) => (
                    <AdjustItem converter={converter} index={index} total={total} confirm={confirm} key={index} />
                )) }
                <AdjustFinish total={total} confirmed={confirmed} next={next} />
            </View>
        </ScrollView>
    )
}
let AdjustItem = (props: { converter: Converter, index: number, total: number, confirm: (p:boolean)=>void }) => {
    let [left,focus,right] = props.converter.MultiValueNeighborhood(props.index)
    let options = props.converter.MultiValueOptions(props.index)
    let tip = props.converter.MultiValueTip(props.index)
    let initialCurrent = props.converter.MultiValueCurrentOverride(props.index)
    let [current,setCurrentLocal] = useState(initialCurrent)
    let setCurrent = (value: string|null) => {
        value = value || null
        setCurrentLocal(value)
        props.converter.MultiValueSetOverride(props.index, value)
        if (Boolean(value) != Boolean(current)) {
            props.confirm(Boolean(value))
        }
    }
    return (
        <View style={styles.adjustItem}>
            <Text>{ `${props.index+1}/${props.total}` }</Text>
            <AdjustPreview left={left} focus={focus} right={right} current={current} />
            <View>
                { options.map(([val,desc]) => (
                    <AdjustOption val={val} desc={desc} current={current} setCurrent={setCurrent} key={val} />
                )) }
            </View>
            <Text>{tip}</Text>
        </View>
    )
}
let AdjustPreview = (props: { left: string, right: string, focus: string, current: string|null }) => {
    let {left,right,focus,current} = props
    let adjusted = Boolean(current)
    let normalize = (text: string): string => {
        return text.replace(/\n/g, '[LF]')
    }
    return (
        <Text style={styles.adjustPreview}>
            <Text>……{normalize(left)}</Text>
            <Text style={adjusted? styles.adjustPreviewFocusAdjusted: styles.adjustPreviewFocusRaw}>
                {adjusted? current: focus}
            </Text>
            <Text>{normalize(right)}……</Text>
        </Text>
    )
}
let AdjustOption = (props: { val: string, desc: string, current: string|null, setCurrent: (val: string|null)=>void }) => {
    let {val,desc,current,setCurrent} = props
    let thisIsCurrent = (current == val)
    return (
        <TouchableNativeFeedback
            onPress={() => setCurrent(val)}
            onLongPress={() => setCurrent(null)} >
            <View style={thisIsCurrent? styles.adjustOptionCurrent: styles.adjustOption}>
                <Text>
                    <Text style={styles.adjustOptionValText}>
                        { (thisIsCurrent? '★ ': '☆ ') + val }
                    </Text>
                    <Text>  {desc}</Text>
                </Text>
            </View>
        </TouchableNativeFeedback>
    )
}
let AdjustFinish = (props: { total: number, confirmed: number, next: (() => void) }) => {
    let {total,confirmed,next} = props
    let allConfirmed = (confirmed == total)
    return (
        <View style={styles.adjustFinish}>
            <Text>
                <Text>共
                    <Text style={styles.adjustFinishTotal}> {total} </Text>
                個調整項，</Text>
                { allConfirmed?
                    <Text>已全部確認。</Text>:
                    <Text>已確認
                        <Text style={styles.adjustFinishConfirmed}> {confirmed} </Text>
                    個。</Text>
                }
            </Text>
            <View style={styles.adjustFinishButtonWrapper}>
                <Button title="生成轉換結果" onPress={next} />
            </View>
        </View>
    )
}

let Output = (props: NativeStackScreenProps<NavigationConfig, 'Output'>) => {
    let {output} = props.route.params
    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.output}>
                <Text selectable={true}>{output}</Text>
            </View>
        </ScrollView>
    )
}

let Stack = createNativeStackNavigator<NavigationConfig>()
let App = () => {
    let opts: Record<keyof NavigationConfig, NativeStackNavigationOptions> = {
        Home: { title: '💡 繁簡轉換' },
        Input: { title: '待轉換內容' },
        Adjust: { title: '調整', headerBackVisible: false, headerRight: () => <Text>返回前一頁請使用手機的返回按鈕</Text> },
        Output: { title: '轉換結果' }
    }
    return (<NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={opts.Home} />
            <Stack.Screen name="Input" component={Input} options={opts.Input} />
            <Stack.Screen name="Adjust" component={Adjust} options={opts.Adjust} />
            <Stack.Screen name="Output" component={Output} options={opts.Output} />
        </Stack.Navigator>
    </NavigationContainer>)
}

export default App


