import {
   StyleSheet,
   Text,
   View,
   Modal,
   Dimensions,
   Image,
   Alert,
} from "react-native";
import React, { useState, useEffect, useReducer } from "react";
import ImagesViewer from "../ImagesViewer";
import VideoPlayer from "../VideoPlayer";
import TextViewer from "../TextViewer";
import Comments from "./Comments";
import { postComments, postLikes, users } from "../../data";
import {
   TextInput,
   useTheme,
   Button,
   IconButton,
   Avatar,
} from "react-native-paper";
import {
   AntDesign,
   Entypo,
   FontAwesome,
   MaterialCommunityIcons,
   Feather,
   Ionicons,
   SimpleLineIcons,
} from "@expo/vector-icons";
import axios from "axios";
import UpdatePostForm from "./UpdatePostForm";
import { Pressable } from "react-native";
import TextShortener from "../TextShortener";
import { useCurrentUser } from "../../utils/CustomHooks";
import LikesComponent from "../LikesComponent";
import moment from "moment";

type NPostComponentProps = PostComponentProps & { navigation: any };
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

const PostComponent = (props: NPostComponentProps) => {
   const [postCommentState, dispatchPostComment] = useReducer(
      postCommentReducer,
      initialState
   );
   const currentUser = useCurrentUser();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [comments, setComments] = useState<Omit<CommentProps, "posterId">[]>(
      []
   );
   const [likes, setLikes] = useState<Like[] | null>(null);
   const [poster, SetPoster] = useState<any>();
   const [liked, setLiked] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const theme = useTheme();

   useEffect(
      function () {
         let fetchData = async () => {
            let activeUserId = currentUser?.id;
            try {
               if (props) {
                  let { data } = await axios.get(
                     `http://192.168.232.183:5000/api/media/posts/cl/${props?.id}`
                  );
                  if (data.status == "success") {
                     // console.log(data.data);
                     let ls: any[] = data.data.likes;
                     let cs = data.data.comments;
                     setComments(cs);
                     setLikes(ls);
                     if (ls.map((like) => like.userId).includes(activeUserId)) {
                        setLiked(true);
                     }
                     // Alert.alert("Success",data.message)
                  } else {
                     Alert.alert("Failed", data.message);
                  }
               }

               setLoading(false);
            } catch (err) {
               Alert.alert("Failed", String(err));
               setLoading(false);
            }
         };
         fetchData();
      },
      [currentUser, props]
   );

   useEffect(
      function () {
         console.log("Fetching user");
         setLoading(true);
         let fetchData = async () => {
            // console.log("Fetching user")
            //  let activeUserId = 1
            try {
               if (props) {
                  let response = await fetch(
                     `http://192.168.232.183:5000/api/auth/users/${props?.userId}`,
                     { method: "GET" }
                  );
                  let data = await response.json();
                  if (data.status == "success") {
                     // console.log("Users-----", data.data);
                     SetPoster(data.data.personal);
                     // Alert.alert("Success",data.message)
                     setLoading(false);
                  } else {
                     Alert.alert("Failed", data.message);
                  }
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
      [props]
   );

   const gotoUserProfile = () => {
      if (currentUser?.id === poster.id) {
         props.navigation.navigate("ProfileScreen", { userId: poster.id });
      } else {
         props.navigation.navigate("UserProfileScreen", { userId: poster.id });
      }
   };

   const handleLike = async (postId: number) => {
      console.log(postId);
      try {
         let activeUserId = currentUser?.id;
         let { data } = await axios.put(
            `http://192.168.232.183:5000/api/media/posts/likes/`,
            { userId: activeUserId, postId: postId }
         );
         if (data.status == "success") {
            console.log(data.data);
            if (liked) {
               if (likes) {
                  setLikes(likes.slice(0, likes.length - 1));
                  setLiked(!liked);
               }
            } else {
               if (likes) {
                  setLikes([...likes, data.data]);
                  setLiked(!liked);
               }
            }

            Alert.alert("Success", data.message);
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

   if (!likes) {
      return (
         <View>
            <Text>Loading post</Text>
         </View>
      );
   }

   return (
      <View style={styles.postContainer}>
         <Modal visible={openModal}>
            <View
               style={{
                  flex: 1,
                  backgroundColor: "#00000068",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 4,
               }}>
               <View style={{ backgroundColor: "#ffffff", paddingTop: 10 }}>
                  {/* <IconButton name='plus'/> */}
                  <Button mode="text" onPress={() => setOpenModal(false)}>
                     <Feather size={26} name="x" />
                  </Button>
                  <UpdatePostForm {...props} />
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
                  {currentUser?.id == props?.userId && (
                     <View>
                        <Button
                           style={{ backgroundColor: "#f9f9f9" }}
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
                  posted {moment(props.createdAt, "YYYYMMDD").fromNow()}
               </Text>
            </View>

            {props.images && <ImagesViewer images={props.images} />}
            {/* {props?.video && <VideoPlayer video={props?.video}/>} */}
         </View>
         <View style={{ marginBottom: 5 }}>
            <View
               style={[
                  styles.likeCommentAmountCon,
                  { borderColor: theme.colors.secondary },
               ]}>
               <View
                  style={{
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "flex-start",
                  }}>
                  <Pressable
                     disabled={loading}
                     onPress={() => handleLike(props.id)}>
                     <Ionicons
                        size={30}
                        color={theme.colors.secondary}
                        name={liked ? "heart-sharp" : "heart-outline"}
                     />
                  </Pressable>
                  <Text style={styles.commentAmountText}>{likes.length}</Text>
               </View>
               <View
                  style={{
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "flex-start",
                  }}>
                  <Pressable>
                     <Ionicons
                        size={30}
                        color={theme.colors.secondary}
                        name="chatbox-outline"
                     />
                  </Pressable>
                  <Text style={styles.commentAmountText}>
                     {comments.length}
                  </Text>
               </View>
            </View>
            <View style={{ paddingHorizontal: 8 }}>
               <Text>
                  <LikesComponent
                     postId={props.id}
                     numberOfLikes={likes.length}
                  />
               </Text>
            </View>
         </View>
         {props.title && <Text style={styles.title}>{props?.title}</Text>}

         {props?.text && (
            <TextShortener
               style={{ marginHorizontal: 8, fontFamily: "Poppins_300Light" }}
               text={props.text}
               onPressViewMore={() =>
                  props.navigation.navigate("FullPostViewScreen", { ...props })
               }
               showViewMore={true}
               textLength={100}></TextShortener>
         )}
         <View>
            <View style={{ padding: 5 }}>
               <Comments
                  posterId={props.userId}
                  navigation={props?.navigation}
                  comments={comments}
               />
            </View>
         </View>
      </View>
   );
};

export default PostComponent;

const styles = StyleSheet.create({
   postContainer: {
      backgroundColor: "#ffffff",
      // marginHorizontal:6,
      marginVertical: 3,
      borderRadius: 4,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: "#f3f3f3",
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
      flexDirection: "row",
      // justifyContent: "space-between",
      gap: 16,
      paddingVertical: 5,
      // borderWidth:1,
      marginLeft: 8,

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
