export type Profile = {
    name: string,
    mappingCharSingle: { [from:string]: string },
    mappingCharMulti: { [from:string]: MultiValue },
    mappingWord: { [from:string]: MultiValue },
    mappingCustom?: { [from:string]: MultiValue }
}

export type MultiValue = {
    to: Option[],
    tip: string
}

export type Option = {
    value: string,
    description: string
}


