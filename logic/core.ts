import {Profile,MultiValue} from './types'
type MultiValueItem = ['char'|'word',number,MultiValue,number]
const FOV = 12

export class Converter {
    private profile: Profile
    private chars: string[]
    private singleMappedChars: string[]
    private multiValues: MultiValueItem[]
    private override: (string|null)[]
    constructor(profile: Profile, input: string) {
        this.profile = profile
        ;[this.chars, this.singleMappedChars] = this.genChars(input)
        this.multiValues = this.genMultiValues()
        this.override = []
    }
    private genChars(input: string): [string[],string[]] {
        let chars: string[] = []
        let singleMappedChars: string[] = []
        for (let char of input) {
            chars.push(char)
            let converted = this.profile.mappingCharSingle[char]
            if (converted) {
                singleMappedChars.push(converted)
            } else {
                singleMappedChars.push(char)
            }
        }
        return [chars, singleMappedChars]
    }
    private genMultiValues(): MultiValueItem[] {
        let multiValues: MultiValueItem[] = []
        let maxWordLength = 0
        for (let word of Object.keys(this.profile.mappingWord)) {
            let length = stringRealLength(word)
            if (length > maxWordLength) {
                maxWordLength = length
            }
        }
        let L = this.charsCount()
        for (let i = 0; i < L; i += 1) {
            let pos = i
            let char = this.chars[i]
            let mv = this.profile.mappingCharMulti[char]
            if (mv) {
                multiValues.push(['char', pos, mv, 1])
            }
            for (let j = 1; j <= maxWordLength && ((i + j) <= L); j += 1) {
                let span = this.chars.slice(i, i+j).join('')
                let spanLength = j
                let mv = this.profile.mappingWord[span]
                if (mv) {
                    multiValues.push(['word', pos, mv, spanLength])
                }
                if (this.profile.mappingCustom) {
                    let mv = this.profile.mappingCustom[span]
                    if (mv) {
                        multiValues.push(['word', pos, mv, spanLength])
                    }
                }
            }
        }
        return multiValues
    }
    private charsCount(): number {
        return this.chars.length
    }
    MultiValuesCount(): number {
        return this.multiValues.length
    }
    MultiValueNeighborhood(index: number): [string,string,string] {
        let L = this.charsCount()
        let [_, pos, __, spanLength] = this.multiValues[index]
        let left = pos
        let right = (pos + spanLength)
        if ((left - FOV) >= 0) { left -= FOV } else { left = 0 }
        if ((right + FOV) < L) { right += FOV } else { right = L }
        return [
            this.singleMappedChars.slice(left, pos).join(''),
            this.singleMappedChars.slice(pos, (pos + spanLength)).join(''),
            this.singleMappedChars.slice((pos + spanLength), right).join(''),
        ]
    }
    MultiValueOptions(index: number): [string,string][] {
        let [_, __, obj] = this.multiValues[index]
        return obj.to.map(({value,description}) => [value, description])
    }
    MultiValueTip(index: number): string {
        let [_, __, obj] = this.multiValues[index]
        return obj.tip
    }
    MultiValueCurrentOverride(index: number): string|null {
        return this.override[index] || null
    }
    MultiValueSetOverride(index: number, value: string|null) {
        this.override[index] = value
    }
    Output(): string {
        var overrideWord: Map<number,[string,number]> = new Map()
        var overrideChar: Map<number,[string,number]> = new Map()
        for (let i = 0; i < this.multiValues.length; i += 1) {
            var [kind, pos, _, spanLength] = this.multiValues[i]
            var value = this.override[i]
            if (value) {
                if (kind == 'word') {
                    if (value != '???') {
                        overrideWord.set(pos, [value, spanLength])
                    }
                } else if (kind == 'char') {
                    overrideChar.set(pos, [value, spanLength])
                }
            }
        }
        var parts: string[] = []
        let i = 0
        outer: while (i < this.charsCount()) {
            for (let override of [overrideWord, overrideChar]) {
                if (override.has(i)) {
                    let [converted, spanLength] = override.get(i)!
                    parts.push(converted)
                    i += spanLength
                    continue outer
                }
            }
            let char = this.singleMappedChars[i]
            parts.push(char)
            i += 1
        }
        return parts.join('')
    }
}

function stringRealLength(s: string): number {
    let l = 0
    for (let _ of s) {
        l += 1
    }
    return l
}


