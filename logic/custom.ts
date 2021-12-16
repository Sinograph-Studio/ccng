import {Profile,MultiValue} from './types'

export function WithCustomConfig(profile: Profile, config: string, options: { reverse?: boolean }): Profile {
    let mappingCustom: Record<string,MultiValue> = {}
    config = config
        .replace(/\r\n/g, '\n')
        .replace(/[ \t　]+/g, ' ')
        .replace(/^ +/g, '')
        .replace(/ +$/g, '')
        .replace(/ +,/g, ',')
        .replace(/, +/g, ',')
    for (let line of config.split('\n')) {
        let [from,to,original] = line.split(',')
        if (options.reverse) {
            [from, to] = [to, from]
        }
        original = (original || '')
        if (from && to) {
            let option = { value: to, description: original }
            if (option.value != '〇') {
                if (mappingCustom[from]) {
                    mappingCustom[from].to.push(option)
                } else {
                    mappingCustom[from] = {
                        to: [option],
                        tip: ''
                    }
                }
            }
        }
    }
    for(let mv of Object.values(mappingCustom)) {
        mv.to.push({ value: '〇', description: '忽略' })
    }
    if (Object.keys(mappingCustom).length == 0) {
        return profile
    } else {
        return {
            ...profile,
            mappingCustom
        }
    }
}


