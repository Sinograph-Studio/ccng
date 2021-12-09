import {Profile,MultiValue} from './types'
type MultiValueItem = ['char'|'word',number,MultiValue,number]
const FOV = 12

export class Converter {
    private profile: Profile
    private chars: string[]
    private multiValues: MultiValueItem[]
    private override: (string|null)[]
    constructor(profile: Profile, input: string) {
        this.profile = profile
        this.chars = this.genChars(input)
        this.multiValues = this.genMultiValues()
        this.override = []
    }
    private genChars(input: string): string[] {
        let chars: string[] = []
        for (let char of input) {
            let converted = this.profile.mappingCharSingle[char]
            if (converted) {
                chars.push(converted)
            } else {
                chars.push(char)
            }
        }
        return chars
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
        for (let i = 0; i < this.chars.length; i += 1) {
            let index = i
            let char = this.chars[i]
            let charMultiValue = this.profile.mappingCharMulti[char]
            if (charMultiValue) {
                multiValues.push(['char', index, charMultiValue, 1])
            }
            for (let j = 1; j < maxWordLength; j += 1) {
                let span = this.chars.slice(i, i+j).join('')
                let wordMultiValue = this.profile.mappingWord[span]
                if (wordMultiValue) {
                    multiValues.push(['word', index, wordMultiValue, j])
                }
            }
        }
        return multiValues
    }
    MultiValuesCount(): number {
        return this.multiValues.length
    }
    MultiValueNeighborhood(index: number): [string,string,string] {
        let [_, pos, __, spanLength] = this.multiValues[index]
        let left = pos
        let right = (pos + spanLength)
        if ((left - FOV) >= 0) { left -= FOV }
        if ((right + FOV) < this.chars.length) { right += FOV }
        return [
            this.chars.slice(left, pos).join(''),
            this.chars.slice(pos, (pos + spanLength)).join(''),
            this.chars.slice((pos + spanLength), right).join(''),
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
                    overrideWord.set(pos, [value, spanLength])
                } else if (kind == 'char') {
                    overrideChar.set(pos, [value, spanLength])
                }
            }
        }
        var parts: string[] = []
        let i = 0
        outer: while (i < this.chars.length) {
            for (let override of [overrideWord, overrideChar]) {
                if (override.has(i)) {
                    let [converted, spanLength] = override.get(i)!
                    parts.push(converted)
                    i += spanLength
                    continue outer
                }
            }
            let char = this.chars[i]
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


