import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

type TextViewerProps = {
    text?:string
}

const TextViewer = ({text}:TextViewerProps) => {
  return (
    <View>
      <Text>TextViewer</Text>
    </View>
  )
}

export default TextViewer

const styles = StyleSheet.create({})