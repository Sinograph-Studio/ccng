import {Profile,MultiValue} from './types'

export class Converter {
    private profile: Profile
    private chars: string[]
    private multiValues: ['char'|'word',number,MultiValue][]
    private override: (string|null)[]
    constructor(profile: Profile, text: string) {
        this.profile = profile
        this.chars = string2chars(text)
        this.multiValues = this.genMultiValues()
        this.override = []
    }
    private genMultiValues(): ['char'|'word',number,MultiValue][] {
        let multiValues: ['char'|'word',number,MultiValue][] = []
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
                multiValues.push(['char', index, charMultiValue])
            }
            for (let j = 1; j < maxWordLength; j += 1) {
                let span = this.chars.slice(i, i+j).join('')
                let wordMultiValue = this.profile.mappingWord[span]
                if (wordMultiValue) {
                    multiValues.push(['word', index, wordMultiValue])
                }
            }
        }
        return multiValues
    }
    MultiValues(): ['char'|'word',number,MultiValue][] {
        return this.multiValues.slice()
    }
    ReadOverride(index: number): string|null {
        return this.override[index] || null
    }
    WriteOverride(index: number, value: string|null) {
        this.override[index] = value
    }
    Output(): string {
        var overrideWord: Map<number,string> = new Map()
        var overrideChar: Map<number,string> = new Map()
        for (let i = 0; i < this.multiValues.length; i += 1) {
            var [kind,pos] = this.multiValues[i]
            var value = this.override[i]
            if (value) {
                if (kind == 'word') {
                    overrideWord.set(pos, value)
                } else if (kind == 'char') {
                    overrideChar.set(pos, value)
                }
            }
        }
        var parts: string[] = []
        let i = 0
        outer: while (i < this.chars.length) {
            for (let override of [overrideWord, overrideChar]) {
                if (override.has(i)) {
                    let converted = override.get(i)!
                    let length = stringRealLength(converted)
                    parts.push(converted)
                    i += length
                    continue outer
                }
            }
            let char = this.chars[i]
            let converted = this.profile.mappingCharSingle[char]
            parts.push(converted)
            i += 1
        }
        return parts.join('')
    }
}

function string2chars(s: string): string[] {
    let chars: string[] = []
    for (let char of s) {
        chars.push(char)
    }
    return chars
}

function stringRealLength(s: string): number {
    let l = 0
    for (let _ of s) {
        l += 1
    }
    return l
}


