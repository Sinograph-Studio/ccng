import data from '../legacy/資料'
import {Profile} from './core'

function mapVal<A,B>(dict: A, f: (a:A[keyof A]) => B): Record<keyof A, B> {
    var b = {} as Record<keyof A, B>
    for (let k in dict) {
        if (Object.prototype.hasOwnProperty.call(dict, k)) {
            b[k] = f(dict[k])
        }
    }
    return b
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

export const Mode = (() => {
    let s2t: Profile = (() => {
        let name = '简化字 → 繁體字'
        let mappingCharSingle =
            Object.assign({}, data.繁化.繁化表, data.繁化.單向繁化表)
        let mappingCharMulti =
            mapVal(data.繁化.一簡多繁表, (表項) => ({
                to: Object.entries(表項.對應字).map(([繁體字,例詞表]) => ({
                    value: 繁體字,
                    description: 例詞表.join(' / ')
                })),
                tip: 表項.注解
            }))
        let mappingWord =
            mapVal(collectToDict(
                Object.entries(data.繁化.專門用語表).flatMap(([類別,用語集]) => 
                    用語集.flatMap((用語) => cartProduct(用語.中, 用語.台).map(([from,to]) => {
                        let original = 用語.原
                        return {from,to,original}
                    }).map(({from,to,original}) => ({
                        k: from,
                        v: [{
                            value: to,
                            description: `[${類別}] ${original}`
                        }]
                    }))
                ))),
                options => ({ to: options, tip: '' })
            )
        return {
            name,
            mappingCharSingle,
            mappingCharMulti,
            mappingWord
        }
    })()
    return {
        s2t
    }
})()


