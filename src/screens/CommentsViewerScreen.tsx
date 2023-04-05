import { StyleSheet, Text, View } from 'react-native'
import React,{useState,useEffect} from 'react'
import Comment from '../components/Comment'
import { Button } from 'react-native-paper'

type CommentsViewerScreenProps = {
    navigation:any,
    route:any
}

const CommentsViewerScreen = ({navigation,route}:CommentsViewerScreenProps) => {

  const [comments,setComments] = useState<CommentProps[]>([])
  const [posterId,setPosterId] = useState<number>()
  const [pageNumber,setPageNumber] = useState<number>(1)
  const [numberOfCommentsPerPage,setNumberOfCommentsPerPage] = useState<number>(20)
  const [numberOfPageLinks,setNumberOfPageLinks] = useState<number>(0)

  useEffect(()=>{
    let {comments:fetchedComments,posterId} = route.params
    setComments(comments)
    setPosterId(posterId)
    let numOfPageLinks = Math.ceil(fetchedComments.length/numberOfCommentsPerPage)
    setNumberOfPageLinks(numOfPageLinks)
  },[])

  useEffect(()=>{
     const currentIndex = numberOfCommentsPerPage * (pageNumber - 1)
     const lastIndex = currentIndex + numberOfCommentsPerPage
     setComments(comments.slice(currentIndex,lastIndex))
  },[pageNumber])

  return (
     <View>
      <Text>Comments</Text>
       <Button onPress={()=> navigation.goBack()}>Back</Button>
       {comments?.map(comment =>{
                return <Comment posterId={posterId} {...comment}/>
            })}
    </View>
  )
}

export default CommentsViewerScreen

const styles = StyleSheet.create({})