import React, { useState } from 'react'
import { View, Text } from "react-native"
import AdMob, { BannerAd, BannerAdSize, TestIds, AdsConsent, AdsConsentStatus, AdsConsentDebugGeography } from '@invertase/react-native-google-ads'

const PublisherID = 'pub-5052227606788762'

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
    ;(async () => {
        // --------------
        if (__DEV__) {
            await AdsConsent.setDebugGeography(AdsConsentDebugGeography.EEA)
        }
        let consentInfo = await AdsConsent.requestInfoUpdate([PublisherID])
        // console.log({ consentInfo })
        if (consentInfo.isRequestLocationInEeaOrUnknown &&
            consentInfo.status == AdsConsentStatus.UNKNOWN) {
            await AdsConsent.showForm({
                privacyPolicy: 'http://sinograph.club/privacy-policy.html',
                withNonPersonalizedAds: true
            })
        }
        // --------------
        await AdMob().initialize()
        setTimeout(() => {
            for (let item of noitfyList) {
                item()
            }
            noitfyList = []
            initFinished = true
        }, 3000)
    })().catch(err => { console.log(err) })
}

export function Ad(props: { id: string, large?: boolean }) {
    let id = (__DEV__)? TestIds.BANNER: props.id
    let [ok,setOk] = useState(false)
    init(() => { setOk(true) })
    return (
        <View style={{ marginVertical: 24, marginHorizontal: 24 }}>
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


