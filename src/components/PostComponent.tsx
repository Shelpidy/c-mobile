import { StyleSheet, Text, View,Modal} from 'react-native'
import React,{useState,useEffect} from 'react'
import ImagesViewer from './ImagesViewer'
import VideoPlayer from './VideoPlayer'
import TextViewer from './TextViewer'
import Comments from './Comments'

type NPostComponentProps = PostComponentProps & {navigation:any}

const PostComponent = (props:NPostComponentProps) => {

  const [currentUser,setCurrentUser] = useState<CurrentUser>({})
  const [openModal,setOpenModal] = useState<boolean>(false)
  const [comments,setComments] = useState<Omit<CommentProps,"posterId">[]>([])
  const [likes,setLikes] = useState<Like[]>([])

  useEffect(()=>{
    setCurrentUser({id:1,email:"mexu.company@gmail.com",accountNumber:"1COM30000000000"})
  },[])

  useEffect(()=>{
    // GET COMMENTS AND LIKES
  },[])

  return (
    <View>
    <Modal visible={openModal}>
        <View>
            <Text>Comment Editor</Text>
        </View>
    </Modal>
      {currentUser.id == props?.userId && <View><Text>Can Edit Post</Text></View>}
      <View>
        {props?.images && <ImagesViewer images={props?.images}/>}
        {props?.video && <VideoPlayer video={props?.video}/>}
      </View>
      <Text>{props?.title}</Text>
        {props?.text && <TextViewer text={props.text}/>}
      <View>
        <View><Text>All comment and Likes Link</Text></View>
        <View><Text>Comment Form</Text></View>
        <View>
            <Text>List of comments</Text>
            <Comments posterId={props.userId} navigation={props?.navigation} comments={comments}/>
        </View>
      </View>
    </View>
  )
}

export default PostComponent

const styles = StyleSheet.create({})