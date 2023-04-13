import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

type PostCommentProps = CommentProps & {update?:boolean}

const PostComment = (props:PostCommentProps) => {
  const [text,setText] = useState<string>("")
  return (
    <View>
      <Text>PostComment</Text>
    </View>
  )
}

export default PostComment

const styles = StyleSheet.create({})