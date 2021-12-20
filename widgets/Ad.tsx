import React, { useState } from 'react'
import { Platform, View, Text } from "react-native";
import AdMob, { BannerAd, BannerAdSize, TestIds } from "@invertase/react-native-google-ads";


let initRequested = false
let initFinished = false
let noitfyList: (() => void)[] = []
function init(notify: () => void) {
    if (initFinished) {
        setTimeout(() => { notify() }, 0)
        return
    }
    noitfyList.push(notify)
    if (initRequested) {
        return
    }
    initRequested = true
    AdMob().initialize().then(_ => {
        initFinished = true
        setTimeout(() => {
            for (let item of noitfyList) {
                item()
            }
            noitfyList = []
        }, 0)
    })
}

export function Ad(props: { id: string, large?: boolean }) {
    let id = Platform.isTesting? TestIds.BANNER: props.id
    let [ok,setOk] = useState(false)
    init(() => setOk(true))
    return (
        <View style={{ marginVertical: 48, marginHorizontal: 24 }}>
            {(ok)?
            <BannerAd
                    unitId={id}
                    size={props.large? BannerAdSize.LARGE_BANNER: BannerAdSize.BANNER}
                    onAdFailedToLoad={err => console.log(err)}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }} />:
            <Text></Text>}
        </View>
    )
}


