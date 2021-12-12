import data from '../legacy/資料'
import {Profile,Option, MultiValue} from './types'

function mapVal<A,B>(dict: A, f: (a:A[keyof A]) => B): Record<keyof A, B> {
    var b = {} as Record<keyof A, B>
    for (let k in dict) {
        if (Object.prototype.hasOwnProperty.call(dict, k)) {
            b[k] = f(dict[k])
        }
    }
    return b
}

function filterKey<A>(dict: A, f: (k: keyof A) => boolean): A {
    var filtered = {} as A
    for (let k in dict) {
        if (Object.prototype.hasOwnProperty.call(dict, k) && f(k)) {
            filtered[k] = dict[k]
        }
    }
    return filtered
}

function invert(rec: Record<string,string>): Record<string, string> {
    var inv = {} as Record<string, string>
    for (let k in rec) {
        if (Object.prototype.hasOwnProperty.call(rec, k)) {
            inv[rec[k]] = k
        }
    }
    return inv
}

function toDict<K extends string, V>(entries: {k:K,v:V}[]): Record<K,V> {
    var r = {} as Record<K,V>
    for (let {k,v} of entries) {
        r[k] = v
    }
    return r
}

function collectToDict<K extends string, I>(entries: {k:K,v:I[]}[]): Record<K,I[]> {
    var r = {} as Record<K,I[]>
    for (let {k,v} of entries) {
        if (r[k]) {
            r[k] = [...r[k], ...v]
        } else {
            r[k] = v
        }
    }
    return r
}

function cartProduct<A,B>(a: undefined | A | A[], b: undefined | B | B[]): [A,B][] {
    var result: [A,B][] = []
    if (typeof a == 'undefined') { a = [] }
    if (typeof b == 'undefined') { b = [] }
    if (!(a instanceof Array)) { a = [a] }
    if (!(b instanceof Array)) { b = [b] }
    for (let u of a) {
        for (let v of b) {
            result.push([u,v])
        }
    }
    return result
}

function wordEntry(from:string, to:string, original: string, category:string): {k:string, v:Option[]} {
    return {
        k: from,
        v: [{
            value: to,
            description: `[${category}] ${original}`
        }]
    }
}

function withInvariant(m: Record<string, MultiValue>): Record<string, MultiValue> {
    for (let k in m) {
        if (Object.prototype.hasOwnProperty.call(m, k)) {
            if (m[k].to.every(opt => opt.value != k)) {
                m[k].to.push({ value: k, description: '不轉換' })
            }
        }
    }
    return m
}

export const Mode = (() => {
    let s2t: Profile = (() => {
        let name = '➡️ 简化字 → 繁體字'
        let mappingCharSingle =
            Object.assign({},
                data.繁化.繁化表,
                data.繁化.單向繁化表,
                toDict(Object.values(data.繁化.正異取捨表).flatMap(表項 =>
                    表項
                    .map(([規範字, 首選字]) => ({k: 規範字, v: 首選字}))
                    .filter(({k,v}) => k != v)
                ))
            )
        let mappingCharMulti =
            withInvariant(mapVal(data.繁化.一簡多繁表, (表項) => ({
                to: Object.entries(表項.對應字).map(([繁體字,例詞表]) => ({
                    value: 繁體字,
                    description: 例詞表.join(' / ')
                })),
                tip: 表項.注解
            })))
        let mappingWord =
            withInvariant(mapVal(collectToDict(
                Object.entries(data.繁化.專門用語表).flatMap(([類別,用語集]) => 
                    用語集.flatMap((用語) => cartProduct(用語.中, 用語.台).map(([from,to]) => {
                        let original = 用語.原
                        return {from,to,original}
                    }).map(({from,to,original}) =>
                        wordEntry(from,to,original,類別)
                    )
                ))),
                options => ({ to: options, tip: '' })
            ))
        return {
            name,
            mappingCharSingle,
            mappingCharMulti,
            mappingWord
        }
    })()
    let t2s: Profile = (() => {
        let name = '➡️ 繁體字 → 简化字'
        let mappingCharSingle =
            Object.assign({},
                invert(data.簡化.繁化表),
                toDict(Object.entries(data.簡化.一簡多繁表).flatMap(([簡化字, 表項]) =>
                    Object.keys(表項.對應字)
                        .filter(繁體字 => !(data.簡化.一繁多簡表[繁體字]))
                        .map(繁體字 => ({k: 繁體字, v: 簡化字}))
                    )
                ),
                toDict(Object.values(data.繁化.正異取捨表).flatMap(表項 =>
                    表項
                    .flatMap(([規範字, 首選字, 次選字]) => [
                        {k: 首選字, v: 規範字},
                        {k: 次選字, v: 規範字},
                    ]))
                    .filter(({k:繁體字}) => !(data.簡化.一繁多簡表[繁體字]))
                    .filter(({k,v}) => k != v)
                )
            )
        let mappingCharMulti =
            withInvariant(mapVal(data.簡化.一繁多簡表, (表項) => ({
                to: Object.entries(表項.對應字).map(([簡化字,例詞表]) => ({
                    value: 簡化字,
                    description: 例詞表.join(' / ')
                })),
                tip: 表項.注解
            })))
        let mappingWord =
            withInvariant(mapVal(collectToDict(
                Object.entries(data.簡化.專門用語表).flatMap(([類別,用語集]) => 
                    用語集.flatMap((用語) => cartProduct(用語.台, 用語.中).map(([from,to]) => {
                        let original = 用語.原
                        return {from,to,original}
                    }).map(({from,to,original}) =>
                        wordEntry(from,to,original,類別)
                    )
                ))),
                options => ({ to: options, tip: '' })
            ))
        return {
            name,
            mappingCharSingle,
            mappingCharMulti,
            mappingWord
        }
    })()
    let s2j: Profile = (() => {
        let name = '↪️ 简化字 → 日本新字体'
        let mappingCharSingle =
            Object.assign({},
                filterKey(
                    Object.assign({},
                        data.新字體化.繁化表,
                        data.新字體化.單向繁化表
                    ),
                    簡化字 => !(簡化字 in data.新字體化.繁化表新字體交集表)
                ),
                data.新字體化.增補一對一新字體表
            )
        let mappingCharMulti =
            withInvariant(mapVal(data.新字體化.一對多新字體表, (表項) => ({
                to: Object.entries(表項.對應字).map(([新字體標準字,例詞表]) => ({
                    value: 新字體標準字,
                    description: ''
                })),
                tip: ''
            })))
        return {
            name,
            mappingCharSingle,
            mappingCharMulti,
            mappingWord: {}
        }
    })()
    return {
        s2t, t2s, s2j
    }
})()


