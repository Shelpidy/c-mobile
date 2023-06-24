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
   Divider,
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
import config from "../.././aws-config";
import AWS from "aws-sdk";
import { Skeleton } from "@rneui/themed";
import { useWindowDimensions } from "react-native";
import HTML from "react-native-render-html";
import { useNavigation } from "@react-navigation/native";

const s3 = new AWS.S3({
   accessKeyId: config.accessKeyId,
   secretAccessKey: config.secretAccessKey,
   region: config.region,
});

type PostComponentProps = {
   post: Post;
   commentsCount: number;
   likesCount: number;
   sharesCount: number;
   user: User;
   liked: boolean;
};

const initialState: PostComment = {};

const postCommentReducer = (
   state: PostComment = initialState,
   action: Action
) => {
   switch (action.type) {
      case "POSTID":
         return {
            ...state,
            userId: action.payload,
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

const PostComponent = (props: PostComponentProps) => {
   const [postCommentState, dispatchPostComment] = useReducer(
      postCommentReducer,
      initialState
   );
   const currentUser = useCurrentUser();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [openShareModal, setOpenShareModal] = useState<boolean>(false);
   const [commentsCount, setCommentsCount] = useState<number>(0);
   const [comments, setComments] = useState<PostComment[]>([]);
   const [likesCount, setLikesCount] = useState<number>(0);
   const [sharesCount, setSharesCount] = useState<number>(0);
   const [liked, setLiked] = useState<boolean>(false);
   const [user, SetUser] = useState<User | null>(null);
   const [shared, setShared] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [loadingShare, setLoadingShare] = useState<boolean>(false);
   const theme = useTheme();
   const [reloadCLS, setRelaodCLS] = useState<number>(0);
   const { width } = useWindowDimensions();
   const navigation = useNavigation<any>();
   

   const source = {
      html: `
    <p style='text-align:center;'>
      Hello World!
    </p>`,
   };

   useEffect(() => {
      setLiked(props.liked);
      setSharesCount(props.sharesCount);
      setLikesCount(props.likesCount);
      setCommentsCount(props.commentsCount);
      SetUser(props.user);
   }, []);

   const gotoUserProfile = () => {
      if (currentUser?.id === user?.id) {
         navigation.navigate("ProfileScreen", { userId: user?.id });
      } else {
         navigation.navigate("UserProfileScreen", { userId: user?.id });
      }
   };

   const handleLike = async (postId: number) => {
      console.log(postId);
      try {
         setLoading(true);
         let activeUserId = currentUser?.id;
         let { data } = await axios.put(
            `http://192.168.182.183:5000/api/media/posts/likes/`,
            { userId: activeUserId, postId: postId }
         );
         if (data.status == "success") {
            let { liked, numberOfLikes } = data.data;
            setLiked(liked);
            setLikesCount(numberOfLikes);

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

   const handleSharedPost = async () => {
      let activeUserId = currentUser?.id;
      setLoadingShare(true);
      setShared(false);
      // let images = props.post.images?.map(image => image?.trimEnd())
      let postObj = {
         postObj: {
            userId: activeUserId,
            title: props.post.title,
            images: JSON.parse(String(props.post.images)),
            video: props.post.video,
            text: props.post.text,
            fromId: props.post.userId,
            shared: true,
         },
         sharedPostId: props.post.id,
      };
      console.log(postObj);
      try {
         let response = await axios.post(
            "http://192.168.182.183:5000/api/media/posts/",
            postObj
         );
         if (response.status === 201) {
            console.log(response.data);
            setLoadingShare(false);
            setShared(true);
            setRelaodCLS(reloadCLS + 1);
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

   if (!props) {
      return (
         <View>
            <View
               style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
               <Skeleton circle width={40} height={40} />
            </View>
            <View>
               <Skeleton width={350} height={400} />
            </View>
         </View>
      );
   }

   return (
      <View style={styles.postContainer}>
         <Modal visible={openShareModal}>
            <View
               style={{
                  flex: 1,
                  backgroundColor: "#00000068",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 4,
               }}>
               <View
                  style={{
                     backgroundColor: "#ffffff",
                     padding: 10,
                     width: width - 20,
                     borderRadius: 5,
                     gap: 20,
                  }}>
                  {/* <IconButton name='plus'/> */}
                  <Button mode="text" onPress={() => setOpenShareModal(false)}>
                     <Feather size={26} name="x" />
                  </Button>
                  <Button
                     style={{
                        backgroundColor: shared
                           ? "green"
                           : theme.colors.primary,
                     }}
                     disabled={loadingShare}
                     loading={loadingShare}
                     onPress={handleSharedPost}
                     mode="contained">
                     <Ionicons />
                     <Ionicons
                        style={{ marginHorizontal: 4 }}
                        size={18}
                        name={shared ? "checkmark" : "share-social-outline"}
                     />
                     <Text>
                        {shared
                           ? "Shared Post Successfully"
                           : "Continue to share as a post"}
                     </Text>
                  </Button>
               </View>
            </View>
         </Modal>
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
                  <Button mode="text" onPress={() => setOpenShareModal(false)}>
                     <Feather size={26} name="x" />
                  </Button>
                  <UpdatePostForm {...props} />
               </View>
            </View>
         </Modal>
         {user && (
            <View
               style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 8,
               }}>
               <Pressable onPress={gotoUserProfile}>
                  <Avatar.Image size={45} source={{ uri: user.profileImage }} />
                  {/* <Image
                     style={styles.profileImage}
                     
                  /> */}
               </Pressable>
               <TextShortener
                  style={{ fontFamily: "Poppins_600SemiBold", margin: 5 }}
                  textLength={23}
                  text={
                     user.firstName +
                     " " +
                     user.middleName +
                     " " +
                     user.lastName
                  }
               />
               <View
                  style={{
                     flex: 1,
                     justifyContent: "flex-end",
                     alignItems: "flex-end",
                     marginBottom: 2,
                     paddingHorizontal: 1,
                     borderRadius: 3,
                  }}>
                  {currentUser?.id == props.post?.userId && (
                     <View>
                        <Button onPress={() => setOpenModal(true)}>
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
                     fontSize: 13,
                  }}>
                  posted {moment(props.post.createdAt).fromNow()}
               </Text>
            </View>

            {props.post.images && <ImagesViewer images={props.post.images} />}
            {/* {props?.video && <VideoPlayer video={props?.video}/>} */}
         </View>

         {props.post.title && (
            <Text style={styles.title}>{props.post?.title}</Text>
         )}

         {props.post?.text && (
            <View style={{ paddingHorizontal: 8 }}>
               <HTML
                  contentWidth={width}
                  baseStyle={{ fontFamily: "Poppins_300Light" }}
                  systemFonts={["Poppins_300Light", "sans-serif"]}
                  source={{ html: props.post.text }}
               />
            </View>
         )}
         <View style={{ marginBottom: 1 }}>
            <View style={{ paddingHorizontal: 8, marginVertical: 4 }}>
               <Text>
                  <LikesComponent
                     postId={props.post.id}
                     numberOfLikes={likesCount}
                  />
               </Text>
            </View>
            <View
               style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
               }}>
               <View
                  style={{
                     flex: 1,
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "center",
                  }}>
                  <Text
                     style={{
                        fontFamily: "Poppins_300Light",
                        fontSize: 12,
                        marginHorizontal: 1,
                     }}>
                     {likesCount}
                  </Text>
                  <Text
                     style={{
                        fontFamily: "Poppins_300Light",
                        fontSize: 12,
                        marginHorizontal: 2,
                     }}>
                     Likes
                  </Text>
               </View>

               <View
                  style={{
                     flex: 1,
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "center",
                  }}>
                  <Text
                     style={{
                        fontFamily: "Poppins_300Light",
                        fontSize: 12,
                        marginHorizontal: 1,
                     }}>
                     {commentsCount}
                  </Text>
                  <Text
                     style={{
                        fontFamily: "Poppins_300Light",
                        fontSize: 12,
                        marginHorizontal: 2,
                     }}>
                     Comments
                  </Text>
               </View>
               <View
                  style={{
                     flex: 1,
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "center",
                  }}>
                  <Text
                     style={{
                        fontFamily: "Poppins_300Light",
                        fontSize: 12,
                        marginHorizontal: 1,
                     }}>
                     {sharesCount}
                  </Text>
                  <Text
                     style={{
                        fontFamily: "Poppins_300Light",
                        fontSize: 12,
                        marginHorizontal: 2,
                     }}>
                     Shares
                  </Text>
               </View>
            </View>
            <Divider style={{ width: width - 40, alignSelf: "center" }} />
            <View style={styles.likeCommentAmountCon}>
               <Button
                  disabled={loading}
                  onPress={() => handleLike(props.post.id)}
                  textColor={theme.colors.secondary}
                  style={{ backgroundColor: "#f6f6f6", flex: 1 }}>
                  <Ionicons
                     size={20}
                     color={theme.colors.secondary}
                     name={liked ? "heart-sharp" : "heart-outline"}
                  />
               </Button>

               <Button
                  contentStyle={{
                     flex: 1,
                     alignItems: "center",
                     flexDirection: "row",
                  }}
                  onPress={() =>
                     navigation.navigate("FullPostViewScreen", {
                        ...props.post,
                     })
                  }
                  textColor={theme.colors.secondary}
                  style={{ backgroundColor: "#f6f6f6", flex: 1 }}>
                  <MaterialCommunityIcons
                     name="comment-outline"
                     size={20}
                     color={theme.colors.secondary}
                  />
                  {/* <Ionicons
                     size={20}
                     color={theme.colors.secondary}
                     name="chatbox-outline"
                  /> */}
               </Button>
               <Button
                  onPress={() => setOpenShareModal(true)}
                  textColor={theme.colors.secondary}
                  style={{ backgroundColor: "#f6f6f6", flex: 1 }}>
                  <MaterialCommunityIcons size={25} name="share-outline" />
               </Button>
            </View>
         </View>
      </View>
   );
};

export default React.memo(PostComponent);

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
      flex: 1,
      flexDirection: "row",
      gap: 14,
      paddingVertical: 5,
      paddingHorizontal: 8,

      // justifyContent:'center',
   },
   commentAmountText: {
      fontFamily: "Poppins_200ExtraLight",
      fontSize: 12,
   },
   profileImage: {
      width: 35,
      height: 35,
      borderRadius: 20,
   },
});
