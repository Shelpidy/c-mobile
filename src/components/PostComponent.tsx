import { StyleSheet, Text, View,Modal, Dimensions} from 'react-native'
import React,{useState,useEffect,useReducer} from 'react'
import ImagesViewer from './ImagesViewer'
import VideoPlayer from './VideoPlayer'
import TextViewer from './TextViewer'
import Comments from './Comments'
import { postComments,postLikes } from '../data'
import { TextInput, useTheme,Button } from 'react-native-paper'
import { AntDesign, Entypo, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'

type NPostComponentProps = PostComponentProps & {navigation:any}
type PostComment = Omit<CommentProps,"posterId">
const initialState:PostComment = {
}

const{width} = Dimensions.get('window')

const postCommentReducer = (state:PostComment = initialState,action:Action)=>{
    switch(action.type){
        case 'POSTID':
            return {
                ...state,posterId:action.payload
            }
        case 'USERID':
            return {
                ...state,userId:action.payload
            }
        case "TEXT":
            return {
                ...state,text:action.payload
            }
        default:
            return state

    }
}


const PostComponent = (props:NPostComponentProps) => {

  const [postCommentState,dispatchPostComment] = useReducer(postCommentReducer,initialState)
  const [currentUser,setCurrentUser] = useState<CurrentUser>({})
  const [openModal,setOpenModal] = useState<boolean>(false)
  const [comments,setComments] = useState<Omit<CommentProps,"posterId">[]>([])
  const [likes,setLikes] = useState<Like[]>([])
  const theme = useTheme()
  
  useEffect(()=>{
    dispatchPostComment({type:"",payload:""})
    setCurrentUser({id:1,email:"mexu.company@gmail.com",accountNumber:"1COM30000000000"})
  },[])

  useEffect(()=>{
    setLikes(postLikes.filter(like => like.postId === props.id))
    setComments(postComments.filter(comment => comment.postId === props.id))
    // GET COMMENTS AND LIKES
  },[])

  return (
    <View style={styles.postContainer}>
     <Modal visible={openModal}>
        <View>
            <Text>Comment Editor</Text>
        </View>
      </Modal>
      {currentUser.id == props?.userId && <View><Text>Can Edit Post</Text></View>}
      <View>
        {props?.images && <ImagesViewer images={props?.images}/>}
        {/* {props?.video && <VideoPlayer video={props?.video}/>} */}
      </View>
      <Text style={styles.title}>{props?.title}</Text>
        {props?.text && <TextViewer text={props.text}/>}
      <View >
        <View style={styles.likeCommentAmountCon}><Button><MaterialCommunityIcons size={20} name='cards-heart-outline'/> {likes.length}</Button><Text style={styles.commentAmountText}><FontAwesome size={28} name='comments-o'/> {comments.length}</Text></View>
        <View style ={styles.commentBox}><TextInput style={[styles.commentInputField,{color:theme.colors.primary}]} right={<TextInput.Icon icon='send'/>} mode='outlined' multiline/><Entypo size={26} name='emoji-neutral'/></View>
        <View>
            <Comments posterId={props.userId} navigation={props?.navigation} comments={comments}/>
        </View>
      </View>
    </View>
  )
}

export default PostComponent

const styles = StyleSheet.create({
    postContainer:{
        backgroundColor:"#ffffff",
        marginHorizontal:6,
        marginVertical:3,
        borderRadius:4,
        padding:10,
        borderWidth:1,
        borderColor:"#f3f3f3"
    },
    commentBox:{
        flex:1,
        flexDirection:"row",
        alignItems:"center",
        gap:5,
        // paddingHorizontal:5
    },
    title:{
        fontFamily:"Poppins_700Bold",
        fontSize:16
    },
    commentInputField:{
        flex:1,
        marginHorizontal:5
    },
    likeCommentAmountCon:{
        flexDirection:'row',
        justifyContent:"space-between",
        // padding:5
    },
    commentAmountText:{
        fontFamily:"Poppins_300Light",
        fontSize:15,
    }
})