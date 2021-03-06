// react, react-native
import React, { useState, useCallback, useEffect } from 'react'
import { Platform, BackHandler, Alert, View, ScrollView, Text, TextInput, Button, TouchableNativeFeedback, StyleProp, TextStyle } from 'react-native'
// react-navigation
import { NavigationContainer, useFocusEffect } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackScreenProps, NativeStackNavigationOptions } from '@react-navigation/native-stack'
// react-native-default-preference
import DefaultPreference from 'react-native-default-preference';
// styles, widgets, logic
import { styles } from './styles'
import { AdInit, AdButton } from './widgets/Ad'
import { P, A, Title, SmallTitle, Sep } from './widgets/P'
import { SimpleList } from './widgets/SimpleList'
import { Profile } from './logic/types'
import { Mode } from './logic/modes'
import { Converter } from './logic/core'
import { WithCustomConfig } from './logic/custom'


type NavigationConfig = {
    Home: undefined,
    About: {},
    Config: { customConfig: string },
    Input: { profile: Profile },
    Adjust: { profile: Profile, input: string },
    Output: { output: string }
}
var globalUpdateCustomConfig: (newValue: string) => void

let Home = (props: NativeStackScreenProps<NavigationConfig, 'Home'>) => {
    let [customConfig, setCustomConfig] = useState('')
    useEffect(() => {
        (async () => {
            let savedValue = ((await DefaultPreference.get('customConfig')) || '')
            setCustomConfig(savedValue)
        })()
    }, [])
    globalUpdateCustomConfig = (newValue) => {
        setCustomConfig(newValue)
        DefaultPreference.set('customConfig', newValue)
    }
    function navigationLink<Name extends keyof NavigationConfig>(name: Name, params: NavigationConfig[Name]): () => void {
        return () => { props.navigation.navigate(name, params) }
    }
    let menu: { title: string, link: () => void }[] = (() => {
        let modeItem = (profile: Profile) => ({
            title: profile.name,
            link:  navigationLink('Input', { profile })
        })
        return [
            { title: '???? ????????????', link: navigationLink('About', {}) },
            { title: '???? ????????????', link: navigationLink('Config', { customConfig }) },
            modeItem(WithCustomConfig(Mode.s2t, customConfig, { reverse: true })),
            modeItem(WithCustomConfig(Mode.t2s, customConfig, {})),
            modeItem(Mode.s2j)
        ]
    })()
    return (
        <SimpleList style={{ flex: 1 }} data={menu} onItemClick={({link}) => link()}>
            { (item) =>
                <Text style={{'color': 'hsl(0, 0%, 35%)','fontSize': 21}}>
                    { item.title }
                </Text>
            }
        </SimpleList>
    );
}

let About = (_: NativeStackScreenProps<NavigationConfig, 'About'>) => {
    let reactNativeVersion = (() => {
        let {major,minor,patch} = Platform.constants.reactNativeVersion
        return `${major}.${minor}.${patch}`
    })()
    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.config}>
                <Title>??????</Title>
                <P>?????????????????? (ccng) ?????????????????????????????????????????????????????????????????????????????????????????????</P>
                <P>???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</P>
                <P>??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</P>
                <Sep/>
                <Title>????????????</Title>
                <P>???????????? MIT ??????????????????????????????</P>
                <A href="https://github.com/mizusato/ccng">
                    GitHub - mizusato/ccng
                </A>
                <P>????????????????????????????????????</P>
                <A href="http://ytenx.org/byohlyuk/KienxPyan">
                    ????????? - ????????????????????????????????????????????????
                </A>
                <P>?????????????????????????????????????????????</P>
                <A href="https://zh.wikipedia.org/wiki/Template:CGroup">
                    ?????????????????? - ??????:CGroup
                </A>
                <Sep/>
                <Title>????????????</Title>
                <P>{`?????? React Native ${reactNativeVersion} ?????????`}</P>
            </View>
        </ScrollView>
    )
}

let Config = (props: NativeStackScreenProps<NavigationConfig, 'Config'>) => {
    let customConfigCurrentValue = props.route.params.customConfig
    let [customConfigBuf, setCustomConfigBuf] = useState(customConfigCurrentValue)
    let save = () => {
        globalUpdateCustomConfig(customConfigBuf)
        props.navigation.goBack()
    }
    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.config}>
                <Title>??? ???????????????</Title>
                <P>??????????????????????????????????????????????????????</P>
                <TextInput
                    multiline
                    style={styles.configTextInput}
                    value={customConfigBuf}
                    onChangeText={setCustomConfigBuf}
                    placeholder="??????????????????"
                />
                <SmallTitle>?????????</SmallTitle>
                <P>????????????,????????????,word</P>
                <SmallTitle>??????</SmallTitle>
                <P>??????,??????,optical disc</P>
                <P>?????????,??????,optical disc drive</P>
                <P>?????????,???????????????,optical disc drive</P>
                <View style={styles.configButtonWrapper}>
                    <Button onPress={save} title="????????????" />
                </View>
            </View>
        </ScrollView>
    )
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
                <Title>{ profile.name }</Title>
                <TextInput
                    multiline
                    style={styles.inputTextInput}
                    value={input}
                    onChangeText={setInput}
                    placeholder="?????????????????????"
                />
                <View style={styles.inputButtonWrapper}>
                    <AdButton onPress={adjust} title="OK"
                        id="ca-app-pub-5052227606788762/6284661612" />
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
                Alert.alert('???????????????', '????????????????????????????????????????????????????????????', [
                    { text: '??????', style: 'cancel', onPress: () => (void 0) },
                    { text: '?????????????????????', style: 'destructive', onPress: () => {
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
            <Text style={styles.adjustTip}>{tip}</Text>
        </View>
    )
}
let AdjustPreview = (props: { left: string, right: string, focus: string, current: string|null }) => {
    let {left,right,focus,current} = props
    let adjusted = Boolean(current)
    let InnerText = (props: { style?: StyleProp<TextStyle>, children: string|null }) => {
        let normalize = (text: string|null): string => {
            return (text || '').replace(/\n/g, '[LF]')
        }
        return <Text style={props.style}>{normalize(props.children)}</Text>
    }
    return (current != '???')? (
        <Text style={styles.adjustPreview}>
            <InnerText>{'??????' + left}</InnerText>
            <InnerText style={adjusted? styles.adjustPreviewFocusAdjusted: styles.adjustPreviewFocusRaw}>
                {adjusted? current: focus}
            </InnerText>
            <InnerText>{right + '??????'}</InnerText>
        </Text>
    ): (
        <Text style={styles.adjustPreview}>
            <InnerText style={styles.adjustPreviewIgnore}>
                {'??????' + left}
            </InnerText>
            <InnerText style={styles.adjustPreviewFocusIgnore}>
                {focus}
            </InnerText>
            <InnerText style={styles.adjustPreviewIgnore}>
                {right + '??????'}
            </InnerText>
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
                        { (thisIsCurrent? '??? ': '??? ') + val }
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
                <Text>???
                    <Text style={styles.adjustFinishTotal}> {total} </Text>
                ???????????????</Text>
                { allConfirmed?
                    <Text>?????????????????????</Text>:
                    <Text>?????????
                        <Text style={styles.adjustFinishConfirmed}> {confirmed} </Text>
                    ??????</Text>
                }
            </Text>
            <View style={styles.adjustFinishButtonWrapper}>
                <Button title="??????????????????" onPress={next} />
            </View>
        </View>
    )
}

let Output = (props: NativeStackScreenProps<NavigationConfig, 'Output'>) => {
    let {output} = props.route.params
    let goHome = () => {
        props.navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }]
        })
    }
    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.output}>
                <Text style={styles.outputTip}>
                    ??????????????????????????????????????????????????????????????????
                </Text>
                <Text selectable={true}>{output}</Text>
                <View style={styles.outputGoHomeButtonWrapper}>
                    <TouchableNativeFeedback onPress={goHome}>
                        <Text style={styles.outputGoHomeButton}>
                            ???? ???????????????
                        </Text>
                    </TouchableNativeFeedback>
                </View>
            </View>
        </ScrollView>
    )
}

let Stack = createNativeStackNavigator<NavigationConfig>()
let App = () => {
    useEffect(() => {
        AdInit()
    }, [])
    let opts: Record<keyof NavigationConfig, NativeStackNavigationOptions> = {
        Home: { title: '????  ??????????????????' },
        About: { title: '????????????' },
        Config: { title: '????????????' },
        Input: { title: '??????' },
        Adjust: { title: '??????', headerBackVisible: false },
        Output: { title: '????????????' }
    }
    return (<NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={opts.Home} />
            <Stack.Screen name="About" component={About} options={opts.About} />
            <Stack.Screen name="Config" component={Config} options={opts.Config} />
            <Stack.Screen name="Input" component={Input} options={opts.Input} />
            <Stack.Screen name="Adjust" component={Adjust} options={opts.Adjust} />
            <Stack.Screen name="Output" component={Output} options={opts.Output} />
        </Stack.Navigator>
    </NavigationContainer>)
}

export default App


