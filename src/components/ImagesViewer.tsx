import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

type ImageViewerProps = {
    images:string[]
}

const ImagesViewer:any = ({images}:ImageViewerProps) => {
  return (
    <View>
      <Text>ImagesViewer</Text>
    </View>
  )
}

export default ImagesViewer

const styles = StyleSheet.create({})