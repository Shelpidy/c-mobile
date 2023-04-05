import { StyleSheet, Text, View,Modal, Dimensions,Image} from 'react-native'
import React,{useState,useEffect,useReducer} from 'react'
import ImagesViewer from './ImagesViewer'
import VideoPlayer from './VideoPlayer'
import TextViewer from './TextViewer'
import Comments from './Comments'
import { postComments,postLikes,users } from '../data'
import { TextInput, useTheme,Button, IconButton } from 'react-native-paper'
import { AntDesign, Entypo, FontAwesome, MaterialCommunityIcons,Feather } from '@expo/vector-icons'

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
  const [poster,SetPoster] = useState<any>()
  const theme = useTheme()
  
  useEffect(()=>{
    dispatchPostComment({type:"",payload:""})
    setCurrentUser({id:1,email:"mexu.company@gmail.com",accountNumber:"1COM30000000000"})
  },[])

  useEffect(()=>{
    setLikes(postLikes.filter(like => like.postId === props.id))
    setComments(postComments.filter(comment => comment.postId === props.id))

    // GET COMMENTS AND LIKES
  },[users,postComments,postLikes])

  useEffect(()=>{
        SetPoster(users.find(user => user.id === props.userId))
  },[users])

  return (
    <View style={styles.postContainer}>
     <Modal visible={openModal}>
        <View>
            <Text>Post Editor</Text>
        </View>
      </Modal>
      {poster && <View style={{flexDirection:"row",alignItems:"center",padding:8}}>
        <Image style={styles.profileImage} source={{uri:poster.profileImage}}/>
        <Text style={{fontFamily:"Poppins_700Bold",margin:5}}>{poster.firstName} {poster.middleName} {poster.lastName}</Text>
        <View style={{flex:1,justifyContent:"flex-end",alignItems:"flex-end",marginBottom:2,paddingHorizontal:1,borderRadius:3}}>
                {currentUser.id == props?.userId &&  <View><Button><Feather name='edit'/> Edit Post</Button></View>}
        </View>
        </View>}
      <View>
        {props?.images && <ImagesViewer images={props?.images}/>}
        {/* {props?.video && <VideoPlayer video={props?.video}/>} */}
      </View>
      <Text style={styles.title}>{props?.title}</Text>
        {props?.text && <TextViewer text={props.text}/>}
      <View >
        <View style={styles.likeCommentAmountCon}>
            <View style={{flexDirection:'row',alignItems:"center",justifyContent:"flex-start"}}><IconButton mode='outlined' size={20} icon="heart-outline"/><Text style={styles.commentAmountText}>{likes.length}</Text>
            </View>
             <View style={{flexDirection:'row',alignItems:"center",justifyContent:"flex-start"}}><IconButton mode='outlined' size={20} icon="comment-outline"/><Text style={styles.commentAmountText}>{comments.length}</Text>
            </View>
            {/* <Text style={styles.commentAmountText}><FontAwesome size={28} name='comments-o'/> {comments.length}</Text> */}
            </View>
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
        fontFamily:"Poppins_400Regular",
        fontSize:16,
    },
      profileImage:{
        width:35,
        height:35,
        borderRadius:20,
      
    },
})