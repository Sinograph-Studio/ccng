import {Profile,MultiValue} from './types'

export class Converter {
    private profile: Profile
    private chars: string[]
    private overrideChar: Map<number,string>
    private overrideWord: Map<number,string>
    private multiValues: [number,'char'|'word',MultiValue][]
    constructor(profile: Profile, text: string) {
        this.profile = profile
        this.chars = string2chars(text)
        this.overrideChar = new Map()
        this.overrideWord = new Map()
        this.multiValues = this.genMultiValues()
    }
    private genMultiValues(): [number,'char'|'word',MultiValue][] {
        let multiValues: [number,'char'|'word',MultiValue][] = []
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
                multiValues.push([index, 'char', charMultiValue])
            }
            for (let j = 1; j < maxWordLength; j += 1) {
                let span = this.chars.slice(i, i+j).join('')
                let wordMultiValue = this.profile.mappingWord[span]
                if (wordMultiValue) {
                    multiValues.push([index, 'word', wordMultiValue])
                }
            }
        }
        return multiValues
    }
    output(): string {
        var parts: string[] = []
        let i = 0
        outer: while (i < this.chars.length) {
            for (let override of [this.overrideWord, this.overrideChar]) {
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


