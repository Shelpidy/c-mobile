import { StyleSheet, Text, View, Modal, Dimensions, Image,Alert, ScrollView } from "react-native";
import React, { useState, useEffect, useReducer } from "react";
import ImagesViewer from "../components/ImagesViewer";
import VideoPlayer from "../components/VideoPlayer";
import TextViewer from "../components/TextViewer";
import Comments from "../components/Comments";
import { postComments, postLikes, users } from "../data";
import { TextInput, useTheme, Button, IconButton } from "react-native-paper";
import {
   AntDesign,
   Entypo,
   FontAwesome,
   MaterialCommunityIcons,
   Feather,
} from "@expo/vector-icons";
import axios from "axios"

type FullPostComponentpost = { navigation: any,route:any };
type PostComment = Omit<CommentProps, "posterId">;
const initialState: PostComment = {};

const { width } = Dimensions.get("window");

const postCommentReducer = (
   state: PostComment = initialState,
   action: Action
) => {
   switch (action.type) {
      case "POSTID":
         return {
            ...state,
            posterId: action.payload,
         };
      case "USERID":
         return {
            ...state,
            userId: action.payload,
         };
      case "TEXT":
         return {
            ...state,
            text: action.payload,
         };
      default:
         return state;
   }
};

const FullPostComponent = ({navigation,route}: FullPostComponentpost) => {
   const [postCommentState, dispatchPostComment] = useReducer(
      postCommentReducer,
      initialState
   );
   const [currentUser, setCurrentUser] = useState<CurrentUser>({});
   const [post,setPost] = useState<PostComponentProps>()
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [comments, setComments] = useState<Omit<CommentProps, "posterId">[]>(
      []
   );
   const [likes, setLikes] = useState<Like[]>([]);
   const [poster, SetPoster] = useState<any>();
   const [liked,setLiked] = useState<boolean>(false)
   const [loading,setLoading] = useState<boolean>(false)
   const theme = useTheme();

 

   useEffect(() => {
      dispatchPostComment({ type: "", payload: "" });
      setCurrentUser({
         id: 1,
         email: "mexu.company@gmail.com",
         accountNumber: "1COM30000000000",
      });
   }, []);

   useEffect(()=>{
      setPost(route.params.post)
      console.log("Post",route.params.post)

   },[])

  useEffect(function(){
      let fetchData = async ()=>{
          let activeUserId = 1
          let postId = route.params.post.id
            try{
               let {data} = await axios.get(`http://192.168.242.183:5000/api/media/posts/cl/${postId}`)
               if(data.status == 'success'){
                  console.log(data.data)
                  let ls:any[] = data.data.likes
                  setComments(data.data.comments);
                  setLikes(data.data.likes);
                  if(ls.map(like => like.userId).includes(activeUserId)){
                      setLiked(true)
                  }
                  // Alert.alert("Success",data.message)
               }else{
                  Alert.alert("Failed",data.message)
               }
               setLoading(false)

            }catch(err){
               Alert.alert("Failed",String(err))
               setLoading(false)
            }
            }
             fetchData()
         }, []);


   useEffect(function(){
      console.log("Fetching user")
      setLoading(true)
      let userId = route.params.post.userId
      let fetchData = async ()=>{
               // console.log("Fetching user")
         //  let activeUserId = 1
            try{
               let response = await fetch(`http://192.168.242.183:5000/api/auth/users/${userId}`,{method:"GET"})
               let data = await response.json()
               if(data.status == 'success'){
                  // console.log("Users-----",data.data)
                   SetPoster(data.data.personal)
                  // Alert.alert("Success",data.message)
                  setLoading(false)
               }else{
                  Alert.alert("Failed",data.message)
                  
               }
               setLoading(false)

            }catch(err){
               console.log(err)
               Alert.alert("Failed",String(err))
               setLoading(false)
            }
             }
         fetchData()
         }, []);

   // useEffect(() => {
   //    setLikes(postLikes.filter((like) => like.postId === post.id));
   //    setComments(
   //       postComments.filter((comment) => comment.postId === post.id)
   //    );

   //    // GET COMMENTS AND LIKES
   // }, [users, postComments, postLikes]);

   // useEffect(() => {
   //    SetPoster(users.find((user) => user.id === post.userId));
   // }, [users]);

  const handleComment = async ()=>{
      setLoading(true)
      let activeUserId = 1
      let commentObj = {...postCommentState,postId:post?.id,userId:activeUserId}
      console.log(commentObj)
        try{
         let {data} = await axios.post(`http://192.168.242.183:5000/api/media/posts/comments/`,commentObj)
         if(data.status == 'success'){
               console.log(data.data)
               setComments([...comments,data.data])
               dispatchPostComment({type:"TEXT",payload:""})
               // Alert.alert("Success",data.message)
         }else{
            Alert.alert("Failed",data.message)
         }
         setLoading(false)

      }catch(err){
          Alert.alert("Failed",String(err))
         setLoading(false)
      }
      

      }

   const handleLike = async(postId:number)=>{
      console.log(postId)
      try{
         let activeUserId = 1
         let {data} = await axios.put(`http://192.168.242.183:5000/api/media/posts/likes/`,{userId:activeUserId,postId:postId})
         if(data.status == 'success'){
               console.log(data.data)
               
               if(liked){
                   setLikes(likes.slice(0,likes.length - 1))
                   setLiked(!liked)
               }else{
                   setLikes([...likes,{id:likes.length,postId:likes[0].postId,userId:currentUser.id,createdAt:new Date(),updatedAt:new Date()}])
                   setLiked(!liked)
               }
               
               Alert.alert("Success",data.message)
         }else{
            Alert.alert("Failed",data.message)
         }
         setLoading(false)

      }catch(err){
          Alert.alert("Failed",String(err))
         setLoading(false)
      }
      
   }

   if(likes.length === 0 && comments.length === 0 || !post){
      return (<View style={{flex:1,justifyContent:'center',alignItems:"center"}}>
         <Text>Loading...</Text>
      </View>)
   }

   return (
      <ScrollView style={styles.postContainer}>
         <Modal visible={openModal}>
            <View
               style={{
                  flex: 1,
                  backgroundColor: "#ffffff88",
                  justifyContent: "center",
                  alignItems: "center",
               }}>
               <View
                  style={{
                     backgroundColor: "#ffffff",
                     padding: 5,
                     borderRadius: 4,
                  }}>
                  <Button onPress={() => setOpenModal(false)}>Back</Button>
                  <Text>Comment Editor</Text>
               </View>
            </View>
         </Modal>
         {poster && (
            <View
               style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 8,
               }}>
               <Image
                  style={styles.profileImage}
                  source={{ uri: poster.profileImage }}
               />
               <Text style={{ fontFamily: "Poppins_600SemiBold", margin: 5 }}>
                  {poster.firstName} {poster.middleName} {poster.lastName}
               </Text>
               <View
                  style={{
                     flex: 1,
                     justifyContent: "flex-end",
                     alignItems: "flex-end",
                     marginBottom: 2,
                     paddingHorizontal: 1,
                     borderRadius: 3,
                  }}>
                  {currentUser.id == post?.userId && (
                     <View>
                        <Button onPress={() => setOpenModal(true)}>
                           <Feather name="edit" /> Edit Post
                        </Button>
                     </View>
                  )}
               </View>
            </View>
         )}
         <View>
            {post?.images && <ImagesViewer images={post?.images} />}
            {/* {post?.video && <VideoPlayer video={post?.video}/>} */}
         </View>
         <Text style={styles.title}>{post?.title}</Text>
         {post?.text && <TextViewer text={post.text} />}
         <View>
            <View style={styles.likeCommentAmountCon}>
               <View
                  style={{
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "flex-start",
                  }}>
                  <IconButton disabled={loading} onPress={()=> handleLike(post.id)} mode='outlined' size={20} icon={liked?"heart":"heart-outline"} />
                  <Text style={styles.commentAmountText}>{likes.length}</Text>
               </View>
               <View
                  style={{
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "flex-start",
                  }}>
                  <IconButton
                     mode='outlined'
                     size={20}
                     icon="comment-outline"
                  />
                  <Text style={styles.commentAmountText}>
                     {comments.length}
                  </Text>
               </View>
               {/* <Text style={styles.commentAmountText}><FontAwesome size={28} name='comments-o'/> {comments.length}</Text> */}
            </View>
            <View style={styles.commentBox}>
               <TextInput
               value={postCommentState.text}
                  onChangeText={(v)=> dispatchPostComment({type:"TEXT",payload:v})}
                  style={[
                     styles.commentInputField,
                     { color: theme.colors.primary },
                  ]}
                  right={<TextInput.Icon disabled={loading} onPress={handleComment} icon="send" />}
                  mode="outlined"
                  multiline
               />
               <Entypo size={26} name="emoji-neutral" />
            </View>
            <View style={{padding:5,marginBottom:10}}>
               <Comments
                  posterId={post?.userId}
                  navigation={navigation}
                  comments={comments}
               />
            </View>
         </View>
      </ScrollView>
   );
};

export default FullPostComponent;

const styles = StyleSheet.create({
   postContainer: {
      backgroundColor: "#ffffff",
      // marginHorizontal:6,
      marginTop: 3,
      borderRadius: 4,
      paddingTop: 10,
      borderWidth: 1,
      borderColor: "#f3f3f3",
      // paddingBottom:20,
      // marginBottom:30
    
   },
   commentBox: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal:15
   },
   title: {
      fontFamily: "Poppins_700Bold",
      fontSize: 16,
      marginHorizontal:10,
      marginTop:6
   },
   commentInputField: {
      flex: 1,
      marginHorizontal: 5,
   },
   likeCommentAmountCon: {
      flexDirection: "row",
      // justifyContent: "space-between",
      gap:15,
      paddingHorizontal:5
   },
   commentAmountText: {
      fontFamily: "Poppins_400Regular",
      fontSize: 16,
   },
   profileImage: {
      width: 35,
      height: 35,
      borderRadius: 20,
   },
});
