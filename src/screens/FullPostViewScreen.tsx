import {
   StyleSheet,
   Text,
   View,
   Modal,
   Dimensions,
   Image,
   Alert,
   ScrollView,
   Pressable,
   KeyboardAvoidingView,
   TextInput,
   useWindowDimensions,
} from "react-native";
import React, { useState, useEffect, useReducer } from "react";
import ImagesViewer from "../components/ImagesViewer";
import VideoPlayer from "../components/VideoPlayer";
import TextViewer from "../components/TextViewer";
import Comments from "../components/MediaPosts/Comments";
import { postComments, postLikes, users } from "../data";
import { useTheme, Button, IconButton, Divider, Avatar } from "react-native-paper";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import {
   AntDesign,
   Entypo,
   FontAwesome,
   MaterialCommunityIcons,
   Feather,
   Ionicons,
   EvilIcons,
   SimpleLineIcons,
} from "@expo/vector-icons";
import axios from "axios";
import { useCurrentUser } from "../utils/CustomHooks";
import LikesComponent from "../components/LikesComponent";
import moment from "moment";
import HTML from "react-native-render-html"
import {LoadingPostComponent} from "../components/MediaPosts/LoadingComponents";
import TextShortener from "../components/TextShortener";


type FullPostComponentpost = { navigation: any; route: any };
type PostComment = Omit<CommentProps, "posterId">;
const initialState: PostComment = {};

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

const FullPostComponent = ({ navigation, route }: FullPostComponentpost) => {
   const [postCommentState, dispatchPostComment] = useReducer(
      postCommentReducer,
      initialState
   );
   const currentUser = useCurrentUser();
   const [post, setPost] = useState<PostComponentProps>();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [comments, setComments] = useState<Omit<CommentProps, "posterId">[]>(
      []
   );
   const [likes, setLikes] = useState<Like[]>([]);
   const [poster, SetPoster] = useState<any>();
   // const [shared, setShared] = useState<boolean>(false);
   const [liked, setLiked] = useState<boolean>(false);
   const [shared, setShared] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [loadingShare, setLoadingShare] = useState<boolean>(false);
   const [shares, setShares] = useState<ShareData[] | null>(null);
   const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
   const [textValue, setTextValue] = useState<string>("");
   const [openShareModal, setOpenShareModal] = useState<boolean>(false);
   const theme = useTheme();
   const [reloadCLS,setRelaodCLS] = useState<number>(0)
   const {width} = useWindowDimensions()

   useEffect(() => {
      setPost(route.params);
      console.log("Post", route.params);
   }, []);

   useEffect(
      function () {
         let fetchData = async () => {
            let activeUserId = currentUser?.id;
            let postId = route.params.id;
            try {
               let { data } = await axios.get(
                  `http://192.168.144.183:5000/api/media/posts/cls/${postId}`
               );
               if (data.status == "success") {
                  console.log(data.data);
                  let ls: any[] = data.data.likes.rows;
                  setComments(data.data.comments.rows);
                  setLikes(data.data.likes.rows);
                  setShares(data.data.shares.rows);
                  if (ls.map((like) => like.userId).includes(activeUserId)) {
                     setLiked(true);
                  }
                  // Alert.alert("Success",data.message)
               } else {
                  Alert.alert("Failed", data.message);
               }
               setLoading(false);
            } catch (err) {
               Alert.alert("Failed", String(err));
               setLoading(false);
            }
         };
         fetchData();
      },
      [currentUser]
   );

   useEffect(
      function () {
         console.log("Fetching user");
         setLoading(true);
         let userId = route.params.userId;
         let fetchData = async () => {
            // console.log("Fetching user")
            //  let activeUserId = 1
            try {
               let response = await fetch(
                  `http://192.168.144.183:5000/api/auth/users/${userId}`,
                  { method: "GET" }
               );
               let data = await response.json();
               if (data.status == "success") {
                  // console.log("Users-----",data.data)
                  SetPoster(data.data.personal);
                  // Alert.alert("Success",data.message)
                  setLoading(false);
               } else {
                  Alert.alert("Failed", data.message);
               }
               setLoading(false);
            } catch (err) {
               console.log(err);
               Alert.alert("Failed", String(err));
               setLoading(false);
            }
         };
         fetchData();
      },
      []
   );

   const toggleEmojiPicker = () => {
      setShowEmojiPicker(!showEmojiPicker);
   };

   const handleEmojiSelect = (emoji: any) => {
      setTextValue(textValue + emoji);
   };

   
   const gotoUserProfile = () => {
      if (currentUser?.id === poster.id) {
         navigation.navigate("ProfileScreen", { userId: poster.id });
      } else {
         navigation.navigate("UserProfileScreen", { userId: poster.id });
      }
   };

   const handleComment = async () => {
      setLoading(true);

      let activeUserId = currentUser?.id;
      let commentObj = {
         text:textValue,
         postId: post?.id,
         userId: activeUserId,
      };
      console.log(commentObj);
      try {
         let { data } = await axios.post(
            `http://192.168.144.183:5000/api/media/posts/comments/`,
            commentObj
         );
         if (data.status == "success") {
            // console.log(data.data);
            setComments([...comments, data.data]);
            dispatchPostComment({ type: "TEXT", payload: "" });
            setTextValue("")
            // Alert.alert("Success",data.message)
         } else {
            Alert.alert("Failed", data.message);
         }
         setLoading(false);
      } catch (err) {
         Alert.alert("Failed", String(err));
         setLoading(false);
      }
   };

     const handleSharedPost = async () => {
      let activeUserId = currentUser?.id;
      setLoadingShare(true)
      setShared(false)
      // let images = props.images?.map(image => image?.trimEnd())
      let postObj = {postObj:{userId:activeUserId,title:post?.title,images:JSON.parse(String(post?.images)),video:post?.video,text:post?.text,fromId:post?.userId,shared:true},sharedPostId:post?.id};
      console.log(postObj)
      try {
         let response = await axios.post(
            "http://192.168.144.183:5000/api/media/posts/",
            postObj
         );
         if (response.status === 201) {
            console.log(response.data);
            setLoadingShare(false);
            setShared(true)
            setRelaodCLS(reloadCLS + 1)
            // Alert.alert("Successful", "Post successfully");
         } else {
            setLoadingShare(false);
            Alert.alert("Failed", "Post Failed");
         }
      } catch (err) {
         setLoadingShare(false);
         console.log(err);
      }

      // console.log(postState);
   };

   const handleLike = async (postId: number) => {
      console.log(postId);
      try {
         let activeUserId = currentUser?.id;
         let { data } = await axios.put(
            `http://192.168.144.183:5000/api/media/posts/likes/`,
            { userId: activeUserId, postId: postId }
         );
         if (data.status == "success") {
            // console.log(data.data);

            if (liked) {
               setLikes(likes.slice(0, likes.length - 1));
               setLiked(!liked);
            } else {
               setLikes([
                  ...likes,
                  {
                     id: likes.length,
                     postId: likes[0].postId,
                     userId: currentUser?.id,
                     createdAt: new Date(),
                     updatedAt: new Date(),
                  },
               ]);
               setLiked(!liked);
            }

            Alert.alert("Success", data.message);
         } else {
            Alert.alert("Failed", data.message);
         }
         setLoading(false);
      } catch (err) {
         Alert.alert("Failed", String(err));
         setLoading(false);
      }
   };

   if ((likes.length === 0 && comments.length === 0) || !post) {
      return (
        <LoadingPostComponent/>
      );
   }

   return (
      <View>
         <ScrollView style={styles.postContainer}>
                <Modal visible={openShareModal}>
            <View
               style={{
                  flex: 1,
                  backgroundColor: "#00000068",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 4,
               }}>
               <View style={{ backgroundColor: "#ffffff", padding: 10,width:width - 20,borderRadius:5,gap:20}}>
                  {/* <IconButton name='plus'/> */}
                  <Button mode="text"  onPress={() => setOpenShareModal(false)}>
                     <Feather size={26} name="x" />
                  </Button>
                  <Button style={{backgroundColor:shared?"green":theme.colors.primary}} disabled={loadingShare} loading={loadingShare} onPress={handleSharedPost} mode="contained"><Ionicons/>
                  <Ionicons
                  style={{marginHorizontal:4}}
                        size={18}
                        name={shared?"checkmark":"share-social-outline"}
                     />
                     <Text>{shared?"Shared Post Successfully":"Continue to share as a post"}</Text>
                  </Button>
               </View>
            </View>
         </Modal>
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
                 <Pressable onPress={gotoUserProfile}>
                  <Avatar.Image
                     size={45}
                     source={{ uri: poster.profileImage }}
                  />
                  {/* <Image
                     style={styles.profileImage}
                     
                  /> */}
               </Pressable>
                   <TextShortener style={{ fontFamily: "Poppins_400Regular", margin: 5 }} textLength={25} text={poster.firstName+"  "+poster.middleName+" "+poster.lastName} />
                  <View
                     style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        marginBottom: 2,
                        paddingHorizontal: 1,
                        borderRadius: 3,
                     }}>
                     {currentUser?.id == post?.userId && (
                        <View>
                           <Button
                             
                              onPress={() => setOpenModal(true)}>
                              <SimpleLineIcons name="options-vertical" />
                           </Button>
                        </View>
                     )}
                  </View>
               </View>
            )}
            <View>
                <View
               style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 8,
                  paddingBottom: 8,
                  gap: 4,
               }}>
               {/* <Text style={{textAlignVertical:"center",color:theme.colors.secondary,fontFamily:"Poppins_300Light",marginRight:2}}>posted</Text> */}
               <AntDesign color={theme.colors.secondary} name="clockcircleo" />
               <Text
                  style={{
                     textAlignVertical: "center",
                     color: theme.colors.secondary,
                     fontFamily: "Poppins_300Light",
                  }}>
                  posted {moment(post.createdAt).fromNow()}
               </Text>
            </View>
               {post?.images && <ImagesViewer images={post?.images} />}
               {/* {post?.video && <VideoPlayer video={post?.video}/>} */}
            </View>
            {post?.title && <Text style={styles.title}>{post?.title}</Text>}

            {post?.text &&  
             <View style={{paddingHorizontal:8}}>
               <HTML contentWidth={width} baseStyle={{fontFamily:"Poppins_300Light"}} systemFonts={["Poppins_300Light",'sans-serif']} source={{html:post.text}}/>
            </View>}
            <View>
               <View style={{ paddingHorizontal: 8,marginVertical:4 }}>
               <Text>
                  <LikesComponent
                     postId={post.id}
                     numberOfLikes={likes.length}
                  />
               </Text>
            </View>
           <View
               style={styles.likeCommentAmountCon}>
                  <Button disabled={loading}
                     onPress={() => handleLike(post.id)} textColor={theme.colors.secondary} style={{backgroundColor:"#f6f6f6",flex:1,alignItems:"center"}}>
                      <Ionicons
                        size={18}
                        color={theme.colors.secondary}
                        name={liked ? "heart-sharp" : "heart-outline"}
                     />
                      <Text style={styles.commentAmountText}>{likes.length}</Text>
                  </Button>
              
                  <Button contentStyle={{
                     backgroundColor:"#f6f6f6",flex:1,alignItems:"center",flexDirection:"row"
                  }} onPress = {()=> navigation.navigate("FullPostViewScreen", { ...post })} textColor={theme.colors.secondary} style={{backgroundColor:"#f6f6f6",flex:1,alignItems:"center"}}>
                   <Ionicons
                        size={18}
                       
                        color={theme.colors.secondary}
                        name="chatbox-outline"
                     />
                      <Text style={styles.commentAmountText}>
                     {comments.length}
                  </Text>
                  </Button>
                  <Button onPress={()=>setOpenShareModal(true)} textColor={theme.colors.secondary} style={{backgroundColor:"#f6f6f6",flex:1}}>
                     <Ionicons
                        size={18}
                        color={theme.colors.secondary}
                        name="share-social-outline"
                     />
                     <Text style={styles.commentAmountText}>
                     {shares?.length}
                  </Text>
                  </Button>
          
            </View>
        
               <View
                  style={{
                     marginTop:5,
                     paddingHorizontal: 15,
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "center",
                  }}>
                  <TextInput
                     value={textValue}
                     placeholder="Comment here..."
                     onChangeText={(v) => setTextValue(v)}
                     style={{
                        flex: 1,
                        backgroundColor: "#f6f6f6",
                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                        height: 50,
                        paddingHorizontal: 25,
                     }}
                  />
                  <Pressable
                     onPress={handleComment}
                     style={{
                        paddingHorizontal: 20,
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                        backgroundColor: "#f6f6f6",
                     }}>
                     <FontAwesome
                        color={theme.colors.primary}
                        name="comment-o"
                        size={23}
                     />
                  </Pressable>
               </View>
               {/* <KeyboardAvoidingView style={styles.commentBox}>
                  <TextInput
                     value={textValue}
                     onChangeText={(v) => setTextValue(v)}
                     style={[
                        styles.commentInputField,
                        { color: theme.colors.primary },
                     ]}
                     right={
                        <TextInput.Icon
                           disabled={loading}
                           onPress={handleComment}
                           icon="send"
                        />
                     }
                     mode="outlined"
                     multiline
                  />
                  <Entypo
                     onPress={toggleEmojiPicker}
                     size={26}
                     name="emoji-neutral"
                  />
               </KeyboardAvoidingView> */}
               <View style={{ padding: 5, marginBottom: 10 }}>
                  <Comments
                     posterId={post?.userId}
                     navigation={navigation}
                     comments={comments}
                  />
               </View>
            </View>
         </ScrollView>
         {showEmojiPicker && (
            <View
               style={{
                  position: "absolute",
                  flex: 1,
                  top: 60,
                  left: 0,
                  right: 0,
                  height: 350,
                  zIndex: 10,
                  backgroundColor: "#ffffff",
               }}>
               <EmojiSelector
                  onEmojiSelected={handleEmojiSelect}
                  showHistory={true}
                  showSearchBar={false}
                  showTabs={false}
                  showSectionTitles={false}
                  category={Categories.all}
                  columns={8}
               />
            </View>
         )}
      </View>
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
      paddingHorizontal: 15,
   },
   title: {
      fontFamily: "Poppins_500Medium",
      marginHorizontal: 10,
      marginTop: 6,
   },
   commentInputField: {
      flex: 1,
      marginHorizontal: 5,
   },
   likeCommentAmountCon: {
      flex:1,
      flexDirection: "row",
      gap: 14,
      paddingVertical: 5,
      paddingHorizontal:8,


      // justifyContent:'center',
   },
   commentAmountText: {
      fontFamily: "Poppins_200ExtraLight",
      fontSize: 16,
   },
   profileImage: {
      width: 35,
      height: 35,
      borderRadius: 20,
   },
});
