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
import { TextInput, useTheme, Button, IconButton } from "react-native-paper";
import {
   AntDesign,
   Entypo,
   FontAwesome,
   MaterialCommunityIcons,
   Feather,
} from "@expo/vector-icons";
import axios from "axios";
import UpdatePostForm from "./UpdatePostForm";

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
   const [currentUser, setCurrentUser] = useState<CurrentUser>({});
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [comments, setComments] = useState<Omit<CommentProps, "posterId">[]>(
      []
   );
   const [likes, setLikes] = useState<Like[] | null>(null);
   const [poster, SetPoster] = useState<any>();
   const [liked, setLiked] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const theme = useTheme();

   useEffect(() => {
      // dispatchPostComment({ type: "", payload: "" });
      setCurrentUser({
         id: 1,
         email: "mexu.company@gmail.com",
         accountNumber: "1COM30000000000",
      });
   }, []);

   useEffect(function () {
      let fetchData = async () => {
         let activeUserId = 1;
         try {
            let { data } = await axios.get(
               `http://192.168.0.104:5000/api/media/posts/cl/${props.id}`
            );
            if (data.status == "success") {
               console.log(data.data);
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
            setLoading(false);
         } catch (err) {
            Alert.alert("Failed", String(err));
            setLoading(false);
         }
      };
      fetchData();
   }, []);

   useEffect(function () {
      console.log("Fetching user");
      setLoading(true);
      let fetchData = async () => {
         // console.log("Fetching user")
         //  let activeUserId = 1
         try {
            let response = await fetch(
               `http://192.168.0.104:5000/api/auth/users/${props.userId}`,
               { method: "GET" }
            );
            let data = await response.json();
            if (data.status == "success") {
               console.log("Users-----", data.data);
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
   }, []);

   // useEffect(() => {
   //    setLikes(postLikes.filter((like) => like.postId === props.id));
   //    setComments(
   //       postComments.filter((comment) => comment.postId === props.id)
   //    );

   //    // GET COMMENTS AND LIKES
   // }, [users, postComments, postLikes]);

   // useEffect(() => {
   //    SetPoster(users.find((user) => user.id === props.userId));
   // }, [users]);

   const handleLike = async (postId: number) => {
      console.log(postId);
      try {
         let activeUserId = 1;
         let { data } = await axios.put(
            `http://192.168.0.104:5000/api/media/posts/likes/`,
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
                  {currentUser.id == props?.userId && (
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
            {props.images && <ImagesViewer images={props.images} />}
            {/* {props?.video && <VideoPlayer video={props?.video}/>} */}
         </View>
         <Text style={styles.title}>{props?.title}</Text>
         {props?.text && <TextViewer text={props.text} />}
         <View>
            <View style={styles.likeCommentAmountCon}>
               <View
                  style={{
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "flex-start",
                  }}>
                  <IconButton
                     disabled={loading}
                     onPress={() => handleLike(props.id)}
                     mode="outlined"
                     size={20}
                     icon={liked ? "heart" : "heart-outline"}
                  />
                  <Text style={styles.commentAmountText}>{likes.length}</Text>
               </View>
               <View
                  style={{
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "flex-start",
                  }}>
                  <IconButton
                     onPress={() =>
                        props.navigation.navigate("FullPostViewScreen", {
                           post: { ...props },
                        })
                     }
                     mode="outlined"
                     size={20}
                     icon="comment-outline"
                  />
                  <Text style={styles.commentAmountText}>
                     {comments.length}
                  </Text>
               </View>
               {/* <Text style={styles.commentAmountText}><FontAwesome size={28} name='comments-o'/> {comments.length}</Text> */}
            </View>
            {/* <View style={styles.commentBox}>
               <TextInput
                  style={[
                     styles.commentInputField,
                     { color: theme.colors.primary },
                  ]}
                  right={<TextInput.Icon icon="send" />}
                  mode="outlined"
                  multiline
               />
               <Entypo size={26} name="emoji-neutral" />
            </View> */}
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
      fontFamily: "Poppins_700Bold",
      fontSize: 16,
      marginHorizontal: 10,
      marginTop: 6,
   },
   commentInputField: {
      flex: 1,
      marginHorizontal: 5,
   },
   likeCommentAmountCon: {
      flexDirection: "row",
      justifyContent: "space-around",
      gap: 15,
      paddingHorizontal: 5,
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
