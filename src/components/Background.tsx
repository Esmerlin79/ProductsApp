import React from 'react'
import { Dimensions, Platform, View } from 'react-native'

const { width, height } = Dimensions.get('screen');

const Background = () => {
    return (
        <View 
            style={{
                position: 'absolute',
                backgroundColor: '#5856D6',
                width: 1000,
                height: 1200,
                top: Platform.OS === 'ios' ? -250 : -350,
                transform: [
                    { rotate: '-70deg' }
                ],
            }}
        />
    ) 
}

export default Background
