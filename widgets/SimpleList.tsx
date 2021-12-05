import React from 'react'
import { FlatList } from 'react-native'
import Item from './Item'
import Separator from './Separator'


export function SimpleList<T>(props: { children: (item:T) => JSX.Element, data: T[], onItemClick: (item:T) => void, style?: { [key:string]:any } }): JSX.Element {
    let mapper = props.children
    let wrapped_data = props.data.map (
        (item_data, i) => ({ item_data, key: String(i) })
    )
    let render_item = (wrapped_item: { item: { item_data: T, key: string } }): JSX.Element => {
        let { item } = wrapped_item
        let { item_data } = item
        let handler = () => {
            if (props.onItemClick) {
                props.onItemClick(item_data)
            }
        }
        return <Item onClick={handler}>{ mapper(item_data) }</Item>
    }
    return (
        <FlatList style={props.style}
                    data={wrapped_data}
                    renderItem={render_item}
                    ItemSeparatorComponent={Separator}
                    ListFooterComponent={Separator}
        />
    )
}


