import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Comment from './Comment'
import { Button, Divider } from 'react-native-paper'

type CommentsProps = {
    comments:CommentProps[]
    posterId?:number,
    navigation?:any
}

const Comments = ({comments,posterId,navigation}:CommentsProps) => {
  return (
    <View>
        <Divider style={{marginTop:10}}/>
      {/* <Text>Comments</Text> */}
       <Button onPress={()=> navigation.navigate("CommentsViewerScreen",{comments,posterId})}>Show All Comments</Button>
       {comments?.map(comment =>{
                return <Comment posterId={posterId} {...comment}/>
            })}
    </View>
  )
}

export default Comments

const styles = StyleSheet.create({})