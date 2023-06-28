import {
   StyleSheet,
   Text,
   View,
   Modal,
   Dimensions,
   Image,
   Alert,
   useWindowDimensions,
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
import UserComponent from "../UserComponent";
import HTML from "react-native-render-html";
import { LoadingPostComponent } from "./LoadingComponents";
import { useNavigation } from "@react-navigation/native";
import { dateAgo } from "../../utils/util";

const s3 = new AWS.S3({
   accessKeyId: config.accessKeyId,
   secretAccessKey: config.secretAccessKey,
   region: config.region,
});

type NSharedPostComponentProps = {
   post: Post;
   commentsCount: number;
   user: User;
   secondUser: User;
   likesCount: number;
   sharesCount: number;
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

const SharedPostComponent = (props: NSharedPostComponentProps) => {
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
   const [user, setUser] = useState<User | null>(null);
   const [secondUser, setSecondUser] = useState<User | null>(null);
   const [shared, setShared] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [loadingShare, setLoadingShare] = useState<boolean>(false);
   const theme = useTheme();
   const [reloadCLS, setRelaodCLS] = useState<number>(0);
   const { width } = useWindowDimensions();
   const navigation = useNavigation<any>();

   useEffect(() => {
      setLiked(props.liked);
      setSharesCount(props.sharesCount);
      setLikesCount(props.likesCount);
      setCommentsCount(props.commentsCount);
      setSecondUser(props.secondUser);
      setUser(props.user);
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
            `http://192.168.148.183:5000/api/media/posts/likes/`,
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

   if (!user) {
      return <LoadingPostComponent />;
   }

   return (
      <View style={styles.postContainer}>
         {user && <UserComponent _user={user} navigation={navigation} />}
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
            <MaterialCommunityIcons
               size={20}
               style={{ marginRight: 10 }}
               name="share-all-outline"
            />
            <AntDesign color={theme.colors.secondary} name="clockcircleo" />
            <Text
               style={{
                  textAlignVertical: "center",
                  color: theme.colors.secondary,
                  fontFamily: "Poppins_300Light",
                  fontSize: 13,
               }}>
               {dateAgo(props.post.createdAt)}
            </Text>
         </View>
         <View style={{ flexDirection: "row" }}></View>
         <Divider />
         {secondUser && (
            <View
               style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 8,
               }}>
               <Pressable onPress={gotoUserProfile}>
                  <Avatar.Image
                     size={45}
                     source={{ uri: secondUser.profileImage }}
                  />
               </Pressable>

               <Text style={{ fontFamily: "Poppins_400Regular", margin: 5 }}>
                  {secondUser.firstName} {secondUser.middleName}{" "}
                  {secondUser.lastName}
               </Text>
            </View>
         )}
         <View>
            {props.post?.images && <ImagesViewer images={props.post?.images} />}

            {/* {props?.video && <VideoPlayer video={props?.video}/>} */}
         </View>
         <View
            style={{
               flex: 1,
               flexDirection: "row",
               justifyContent: "flex-end",
               paddingHorizontal: 4,
            }}>
            <Button
               labelStyle={{
                  color: theme.colors.secondary,
                  fontFamily: "Poppins_300Light",
                  fontSize: 13,
               }}
               style={{
                  borderColor: theme.colors.secondary,
                  minWidth: 100,
                  borderRadius: 4,
               }}
               mode="text"
               onPress={() =>
                  navigation.navigate("FullPostViewScreen", {
                     ...props.post, 
                     userId: props.post.fromId,
                     id: props.post.fromPostId,
                  })
               }>
               View Post
            </Button>
         </View>
         {props.post?.title && (
            <Text style={styles.title}>{props.post?.title}</Text>
         )}

         {props.post?.text && (
            <View style={{ paddingHorizontal: 8 }}>
               <HTML
                  contentWidth={width}
                  baseStyle={{ fontFamily: "Poppins_300Light" }}
                  systemFonts={["Poppins_300Light", "sans-serif"]}
                  source={{ html: props.post?.text }}
               />
            </View>
         )}
         <Divider style={{ marginVertical: 10 }} />
         <View style={{ marginBottom: 1 }}>
            <View style={{ paddingHorizontal: 8, marginVertical: 5 }}>
               <Text>
                  <LikesComponent
                     postId={props.post?.id}
                     numberOfLikes={likesCount}
                  />
               </Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
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
                        marginHorizontal: 1,
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
                        marginHorizontal: 1,
                     }}>
                     Comments
                  </Text>
               </View>
            </View>
            <Divider style={{ width: width - 40, alignSelf: "center" }} />
            <View style={styles.likeCommentAmountCon}>
               <Button
                  disabled={loading}
                  onPress={() => handleLike(props.post?.id)}
                  textColor={theme.colors.secondary}
                  style={{
                     backgroundColor: "#f6f6f6",
                     flex: 1,
                     alignItems: "center",
                  }}>
                  <Ionicons
                     size={18}
                     color={theme.colors.secondary}
                     name={liked ? "heart-sharp" : "heart-outline"}
                  />
               </Button>

               <Button
                  contentStyle={{
                     backgroundColor: "#f6f6f6",
                     flex: 1,
                     alignItems: "center",
                     flexDirection: "row",
                  }}
                  onPress={() =>
                     navigation.navigate("FullSharedPostViewScreen", {
                        ...props.post,
                     })
                  }
                  textColor={theme.colors.secondary}
                  style={{
                     backgroundColor: "#f6f6f6",
                     flex: 1,
                     alignItems: "center",
                  }}>
                  <Ionicons
                     size={18}
                     color={theme.colors.secondary}
                     name="chatbox-outline"
                  />
               </Button>
            </View>
         </View>
      </View>
   );
};

export default SharedPostComponent;

const styles = StyleSheet.create({
   postContainer: {
      backgroundColor: "#ffffff",
      // marginHorizontal:6,
      marginVertical: 3,
      paddingVertical: 10,
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
      fontSize: 16,
   },
   profileImage: {
      width: 35,
      height: 35,
      borderRadius: 20,
   },
});
