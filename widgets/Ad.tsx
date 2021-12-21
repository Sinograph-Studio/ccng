import React, { useEffect, useState } from 'react'
import { View, Text, Button, StyleProp, ViewStyle } from "react-native"
import AdMob, { InterstitialAd, AdEventType, BannerAd, BannerAdSize, TestIds, AdsConsent, AdsConsentStatus, AdsConsentDebugGeography } from '@invertase/react-native-google-ads'

const PublisherID = 'pub-5052227606788762'
const AdWrapperStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: 'hsl(0, 0%, 75%)'
}

let initFinished = false
export function AdInit() {
    if (initFinished) {
        return
    }
    (async () => {
        if (__DEV__) {
            await AdsConsent.setDebugGeography(AdsConsentDebugGeography.EEA)
        }
        let consentInfo = await AdsConsent.requestInfoUpdate([PublisherID])
        if (consentInfo.isRequestLocationInEeaOrUnknown &&
            consentInfo.status == AdsConsentStatus.UNKNOWN) {
            await AdsConsent.showForm({
                privacyPolicy: 'http://sinograph.club/privacy-policy.html',
                withNonPersonalizedAds: true
            })
        }
        await AdMob().initialize()
        initFinished = true
    })().catch(err => { console.log(err) })
}

function Banner(props: { ok: boolean, id: string, large?: boolean }) {
    let id = (__DEV__)? TestIds.BANNER: props.id
    return (
        <View style={AdWrapperStyle}>
            {(props.ok)?
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

export function Ad(props: { id: string, large?: boolean }) {
    let ok = initFinished
    return <Banner ok={ok} id={props.id} large={props.large} />
}

export function AdButton(props: { id: string, p?: number, title: string, onPress: () => void }) {
    let id = (__DEV__)? TestIds.INTERSTITIAL: props.id
    let p = props.p || 1.0
    let [advert] = useState(() => {
        return InterstitialAd.createForAdRequest(id, {
            requestNonPersonalizedAdsOnly: true
        })
    })
    let [advertLoaded, setAdvertLoaded] = useState(false)
    useEffect(() => {
        let unsubscribe = advert.onAdEvent(t => {
            if (t === AdEventType.LOADED) {
                setAdvertLoaded(true);
            }
        })
        advert.load()
        return () => {
            unsubscribe()
        }
    }, [])
    let title = props.title
    let onPress = () => {
        if (advertLoaded) {
            if (Math.random() <= p) {
                advert.show()
            }
        }
        props.onPress()
    }
    return <Button title={title} onPress={onPress} />
}


