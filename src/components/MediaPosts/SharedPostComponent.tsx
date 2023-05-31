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
import UserComponent from "../UserComponent";

const s3 = new AWS.S3({
   accessKeyId: config.accessKeyId,
   secretAccessKey: config.secretAccessKey,
   region: config.region,
});

type NSharedPostComponentProps = PostComponentProps & { navigation: any };
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

const SharedPostComponent = (props: NSharedPostComponentProps) => {
   const [postCommentState, dispatchPostComment] = useReducer(
      postCommentReducer,
      initialState
   );
   const currentUser = useCurrentUser();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [openShareModal, setOpenShareModal] = useState<boolean>(false);
   const [comments, setComments] = useState<Omit<CommentProps, "posterId">[]>(
      []
   );
   const [likes, setLikes] = useState<Like[] | null>(null);
   const [secondUser, setSecondUser] = useState<User| null>(null);
   const [liked, setLiked] = useState<boolean>(false);
   const [shares, setShares] = useState<ShareData[]|null>(null);
   const [poster, SetPoster] = useState<any>();
   const [shared, setShared] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [loadingShare, setLoadingShare] = useState<boolean>(false);
   const theme = useTheme();
   const [reloadCLS,setRelaodCLS] = useState<number>(0)

   
   useEffect(function () {
      console.log("Fetching user");
      setLoading(true);
      let fetchData = async () => {
         // console.log("Fetching user")
         //  let activeUserId = 1
         try {
            let response = await fetch(
               `http://192.168.136.183:5000/api/auth/users/${props.fromId}`,
               { method: "GET" }
            );
            let data = await response.json();
            if (data.status == "success") {
               // console.log("Users-----", data.data);
               setSecondUser(data.data.personal);
               // Alert.alert("Success",data.message)
            
            } else {
               Alert.alert("Failed", data.message);
            }
          
         } catch (err) {
            console.log(err);
            Alert.alert("Failed", String(err));
         
         }
      };
      fetchData();
   }, []);


   useEffect(
      function () {
         let fetchData = async () => {
            let activeUserId = currentUser?.id;
            try {
               if (props) {
                  let { data } = await axios.get(
                     `http://192.168.136.183:5000/api/media/posts/cls/${props?.id}`
                  );
                  if (data.status == "success") {
                     // console.log(data.data);
                     let ls: any[] = data.data.likes.rows;
                     let cs = data.data.comments.rows;
                     let sh = data.data.shares.rows
                     setComments(cs);
                     setLikes(ls);
                     setShares(sh)
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
      [currentUser, props,reloadCLS]
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
                     `http://192.168.136.183:5000/api/auth/users/${props?.userId}`,
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
            `http://192.168.136.183:5000/api/media/posts/likes/`,
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
        {
            poster && (
               <UserComponent _user = {poster} navigation={props.navigation} />
            )
        }
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
                <MaterialCommunityIcons size={20} style={{marginRight:10}} name="share-all-outline" />
               <AntDesign color={theme.colors.secondary} name="clockcircleo" />
               <Text
                  style={{
                     textAlignVertical: "center",
                     color: theme.colors.secondary,
                     fontFamily: "Poppins_300Light",
                  }}>
                 {moment(props.createdAt).fromNow()}
               </Text>
            </View>
        <View style={{flexDirection:'row'}}>
         
        </View>
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
                  {/* <Image
                     style={styles.profileImage}
                     
                  /> */}
               </Pressable>

               <Text style={{ fontFamily: "Poppins_600SemiBold", margin: 5 }}>
                  {secondUser.firstName} {secondUser.middleName} {secondUser.lastName}
               </Text>
            </View>
         )}
         <View>
        

            {props.images && <ImagesViewer images={props.images} />}
            {/* {props?.video && <VideoPlayer video={props?.video}/>} */}
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
         <Divider style={{marginVertical:10}} />
          <View style={{ marginBottom:1}}>
             <View style={{ paddingHorizontal: 8,marginVertical:5}}>
               <Text>
                  <LikesComponent
                     postId={props.id}
                     numberOfLikes={likes.length}
                  />
               </Text>
            </View>
            <View
               style={styles.likeCommentAmountCon}>
                  <Button disabled={loading}
                     onPress={() => handleLike(props.id)} textColor={theme.colors.secondary} style={{backgroundColor:"#f6f6f6",flex:1,alignItems:"center"}}>
                      <Ionicons
                        size={18}
                        color={theme.colors.secondary}
                        name={liked ? "heart-sharp" : "heart-outline"}
                     />
                      <Text style={styles.commentAmountText}>{likes.length}</Text>
                  </Button>
              
                  <Button contentStyle={{
                     backgroundColor:"#f6f6f6",flex:1,alignItems:"center",flexDirection:"row"
                  }} onPress = {()=>props.navigation.navigate("FullPostViewScreen", { ...props })} textColor={theme.colors.secondary} style={{backgroundColor:"#f6f6f6",flex:1,alignItems:"center"}}>
                   <Ionicons
                        size={18}
                       
                        color={theme.colors.secondary}
                        name="chatbox-outline"
                     />
                      <Text style={styles.commentAmountText}>
                     {comments.length}
                  </Text>
                  </Button>
            </View>
           
         </View>
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

export default SharedPostComponent;

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
