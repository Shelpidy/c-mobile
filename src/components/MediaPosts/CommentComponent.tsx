import {
   Modal,
   StyleSheet,
   Text,
   View,
   Image,
   Alert,
   Pressable,
   TextInput,
   TouchableHighlight,
   KeyboardAvoidingView,
   ScrollView,
   Dimensions,
   FlatList,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { users } from "../../data";
import {
   MaterialCommunityIcons,
   SimpleLineIcons,
   FontAwesome,
   AntDesign,
   EvilIcons,
   Ionicons,
} from "@expo/vector-icons";
import {
   Avatar,
   Button,
   Divider,
   useTheme,
   ActivityIndicator,
} from "react-native-paper";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useCurrentUser } from "../../utils/CustomHooks";
import TextShortener from "../TextShortener";
import { Skeleton } from "@rneui/themed";
import { dateAgo } from "../../utils/util";


type Comment = {
   commentId: string;
   refId: string;
   userId: number;
   text: string;
   createdAt: Date;
   updatedAt: Date;
   repliesCount: number;
   likesCount: number;
   liked: boolean;
   createdBy: User;
};

type CommentProps = {
   comment: Comment;
   blogOwnerId?:string;
   size?: "normal" | "small";
};


const { height, width } = Dimensions.get("window");

const CommentComponent = (props: CommentProps) => {
   const currentUser = useCurrentUser();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [openRepliesModal, setOpenRepliesModal] = useState<boolean>(false);
   const [commentor, setCommentor] = useState<User | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
   const [commentText, setCommentText] = useState<string>("");
   const [replyText, setReplyText] = useState<string>("");
   const [comment, setComment] = useState<Comment>(props.comment);
   const [replies, setReplies] = useState<Comment[]>([]);
   const [likesCount, setLikesCount] = useState<number>(0);
   const [liked, setLiked] = useState<boolean>(false);
   const [repliesCount, setRepliesCount] = useState<number>(0);
   const page = React.useRef<number>(1);
   const [hasMore, setHasMore] = useState(true);

   const theme = useTheme();
   const inputRef = useRef<TextInput>(null);
   const navigation = useNavigation<any>();

   let fetchData = async (pageNum?: number) => {
      let pageNumber = pageNum ?? page.current;
      console.log("Replies PageNumber", pageNumber);
      if (!hasMore) return;
      try {
         setLoadingFetch(true);
         if (currentUser) {
            let commentId = props.comment.commentId;
            console.log(commentId, currentUser);
            let response = await fetch(
               `http://192.168.148.183:5000/api/blogs/comments/${commentId}?pageNumber=${pageNumber}&numberOfRecords=5`
            );
            let { data } = await response.json();
            if (response.ok) {
               setReplies((prev) => (prev ? [...prev, ...data ] : data));
               if (data.length > 0) {
                  page.current++;
               }
               console.log("Replies=>", data);
               setLoadingFetch(false);
               if (data.length < 5) {
                  setHasMore(false);
               }
            } else {
               Alert.alert("Failed", data.message);
               setLoadingFetch(false);
            }
         }
      } catch (err) {
         console.log("From Comment", String(err));
         Alert.alert("Failed Comment", String(err));
         setLoadingFetch(false);
      }
   };

   const handleLoadMore = () => {
      console.log("Replies end reached");
      if (loadingFetch) return;
      fetchData();
   };


   useEffect(() => {
      setComment(props.comment);
      setCommentor(props.comment.createdBy);
      setLiked(props.comment.liked);
      setLikesCount(props.comment.likesCount);
      setRepliesCount(props.comment.repliesCount);
   }, []);

   useEffect(
      function () {
         fetchData(1);
      },
      [currentUser, repliesCount]
   );

   const handleReplyModal = () => {
      setOpenRepliesModal(true);
      inputRef.current?.focus();
   };

   const handleReply = async () => {
      setLoading(true);

      let activeUserId = currentUser?.userId;
      let replyObj = {
         text: replyText,
         userId: activeUserId,
      };
      console.log("ReplyObj", replyObj);
      try {
         let { data } = await axios.post(
            `http://192.168.148.183:5000/comments/${comment.commentId}/`,
            replyObj,{
               headers:{
                  Authorization:'Bear jsskssideofd4fiu8'
               }
            }
         );
         if (data.status == "success") {
            console.log(data.data);
            setReplies((prev) => (prev ? [data.data, ...prev] : [data.data]));
            setReplyText("");
            setRepliesCount((prev) => prev + 1);

            // setComment(comment);

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

   const handleLike = async (commentId:string) => {
      console.log(commentId);
      try {
         setLoading(true);
         let activeUserId = currentUser?.userId;
         let { data, status } = await axios.put(
            `http://192.168.148.183:5000/comments/${commentId}/likes/`,
            { userId: activeUserId}
         );
         if (status === 202) {
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

   const handleUpdateComment = () => {
      setLoading(true);
      async function UpdateComment() {
         try {
            let putObj = { text: commentText, userId: comment?.userId };
            let response = await axios.put(
               "`http://192.168.148.183:5000/media/posts/comments",
               putObj
            );
            if (response.status == 202) {
               setComment({ ...comment, text: commentText });
               Alert.alert("Success", "Comment Updated");
            } else {
               Alert.alert("Failed", response.data.message);
            }
            setLoading(false);
         } catch (err) {
            console.log(err);
            Alert.alert("Failed", String(err));
            setLoading(false);
         }
      }
      UpdateComment();
   };

   const gotoUserProfile = () => {
      if (currentUser?.userId === commentor?.userId) {
         navigation.navigate("ProfileScreen", { userId: commentor?.userId });
      } else {
         navigation.navigate("UserProfileScreen", { userId: commentor?.userId });
      }
   };


   const renderFooter = () => {
      if (!loadingFetch) return null;
      return (
         <View
            style={{
               flexDirection: "row",
               padding: 10,
               justifyContent: "center",
               alignItems: "center",
               backgroundColor: "white",
            }}>
            <ActivityIndicator color="#cecece" size="small" />
            <Text style={{ color: "#cecece", marginLeft: 5 }}>Loading</Text>
         </View>
      );
   };

   const renderItem = ({ item }: any) => (
      <CommentComponent
         comment={item}
         blogOwnerId={props.blogOwnerId}
      />
   );

   const renderSkeleton = () => (
      <View>
         <View
            style={{
               flex: 1,
               flexDirection: "row",
               justifyContent: "flex-start",
               gap: 4,
               margin: 3,
            }}>
            <Skeleton animation="wave" circle width={50} height={50} />
            <Skeleton
               style={{ borderRadius: 5, marginTop: 4 }}
               animation="wave"
               width={width - 70}
               height={80}
            />
         </View>
         <View
            style={{
               flex: 1,
               flexDirection: "row",
               justifyContent: "flex-start",
               gap: 4,
               margin: 3,
            }}>
            <Skeleton animation="wave" circle width={50} height={50} />
            <Skeleton
               style={{ borderRadius: 5, marginTop: 4 }}
               animation="wave"
               width={width - 70}
               height={80}
            />
         </View>
         <View
            style={{
               flex: 1,
               flexDirection: "row",
               justifyContent: "flex-start",
               gap: 4,
               margin: 3,
            }}>
            <Skeleton animation="wave" circle width={50} height={50} />
            <Skeleton
               style={{ borderRadius: 5, marginTop: 4 }}
               animation="wave"
               width={width - 70}
               height={80}
            />
         </View>
         <View
            style={{
               flex: 1,
               flexDirection: "row",
               justifyContent: "flex-start",
               gap: 4,
               margin: 3,
            }}>
            <Skeleton animation="wave" circle width={50} height={50} />
            <Skeleton
               style={{ borderRadius: 5, marginTop: 4 }}
               animation="wave"
               width={width - 70}
               height={80}
            />
         </View>
      </View>
   );
 
   return (
      <KeyboardAvoidingView style={styles.container}>
         <Modal visible={openRepliesModal}>
            <View
               style={{
                  position: "relative",
                  backgroundColor: "#00000099",
               }}>
               <ScrollView
                  style={{
                     top: height / 7,
                     borderTopRightRadius: 8,
                     borderTopLeftRadius: 8,
                     backgroundColor: "#fff",
                     paddingBottom: 100,
                  }}>
                  <View
                     style={{
                        width: "100%",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                     }}>
                     <Button onPress={() => setOpenRepliesModal(false)}>
                        <AntDesign size={18} name="close" />
                     </Button>
                  </View>
                  {replies.length < 1 && (
                     <View style={{ width: "100%", alignItems: "center" }}>
                        <MaterialCommunityIcons
                           name="comment-outline"
                           style={{ fontWeight: "normal", opacity: 0.6 }}
                           size={200}
                           color={theme.colors.secondary}
                        />
                        <Text
                           style={{
                              fontFamily: "Poppins_300Light",
                              textAlign: "center",
                              margin: 10,
                           }}>
                           Be the first to comment
                        </Text>
                     </View>
                  )}
                  <FlatList
                     style={{ paddingHorizontal: 10 }}
                     data={replies}
                     renderItem={renderItem}
                     keyExtractor={(item) => String(item?.commentId)}
                     onEndReached={handleLoadMore}
                     onEndReachedThreshold={0.2}
                     ListFooterComponent={renderFooter}
                     ListEmptyComponent={renderSkeleton}
                  />
                  <KeyboardAvoidingView
                     style={{
                        marginTop: 5,
                        paddingHorizontal: 20,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                     }}>
                     <TextInput
                        multiline
                        ref={inputRef}
                        value={replyText}
                        placeholder="Comment here..."
                        onChangeText={(v) => setReplyText(v)}
                        style={{
                           flex: 1,
                           borderTopLeftRadius: 20,
                           borderBottomLeftRadius: 20,
                           height: 50,
                           paddingHorizontal: 25,
                        }}
                     />
                     <Button
                        loading={loading}
                        disabled={loading}
                        mode="text"
                        onPress={handleReply}
                        style={{
                           paddingHorizontal: 20,
                           height: 50,
                           alignItems: "center",
                           justifyContent: "center",
                           borderTopRightRadius: 20,
                           borderBottomRightRadius: 20,
                        }}>
                        <FontAwesome
                           color={theme.colors.secondary}
                           name="send"
                           size={20}
                        />
                     </Button>
                  </KeyboardAvoidingView>
                  <View style={{ height: height / 5 }}></View>
               </ScrollView>
            </View>
         </Modal>
         <Modal visible={openModal}>
            <View
               style={{
                  flex: 1,
                  backgroundColor: "#00000099",
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
                  <View style={{ margin: 6 }}>
                     <Text
                        style={{
                           fontFamily: "Poppins_400Regular",
                           color: theme.colors.primary,
                           textAlign: "center",
                        }}>
                        Update Comment
                     </Text>
                  </View>
                  <View
                     style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        paddingHorizontal: 15,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10,
                     }}>
                     <TextInput
                        value={commentText}
                        placeholder="Comment here..."
                        onChangeText={(v) => setCommentText(v)}
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
                        onPress={handleUpdateComment}
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
                           name="send"
                           size={21}
                        />
                     </Pressable>
                  </View>
               </View>
            </View>
         </Modal>
         {commentor && (
            <View>
               <View style={styles.commentorMedia}>
                  <Pressable onPress={gotoUserProfile}>
                     <Avatar.Image
                        source={{ uri: commentor.profileImage }}
                        size={props.size === "small" ? 28 : 35}
                     />
                     {/* <Image
                        style={styles.profileImage}
                        source={{ uri: commentor.profileImage }}
                     /> */}
                  </Pressable>
                  <View
                     style={{
                        // backgroundColor: "#f5f5f5",
                        flex: 1,
                        borderRadius: 30,
                        paddingLeft: 2,
                        paddingRight: 15,
                        paddingVertical: 2,
                     }}>
                     <View
                        style={{
                           flex: 1,
                           flexDirection: "row",
                           alignItems: "flex-start",
                           justifyContent: "space-between",
                        }}>
                        <TextShortener
                        
                        style={{
                           ...styles.userFullName,
                           fontSize: props.size === "small" ? 12 : 14,
                        }}
                           textLength={24}
                           text={
                              commentor.fullName
                           }
                        />
                        {(currentUser?.userId == commentor.userId ||
                           currentUser?.userId == props?.blogOwnerId) && (
                           <SimpleLineIcons
                              style={{ marginTop: 6 }}
                              onPress={() => setOpenModal(true)}
                              name="options"
                           />
                        )}
                     </View>

                     <Text
                      style={{
                        fontFamily: "Poppins_300Light",
                        paddingHorizontal: 5,
                        fontSize: props.size === "small" ? 11 : 13,
                     }}>
                        {comment?.text}
                     </Text>
                     {/* <Text>Comment Likes</Text>  */}
                     <View
                        style={{
                           flex: 1,
                           justifyContent: "flex-start",
                           flexDirection: "row",
                           alignItems: "center",
                           marginTop: 2,
                           paddingHorizontal: 5,
                           borderRadius: 3,
                           gap: 1,
                        }}>
                        {comment.createdAt && (
                           <Text
                              style={{
                                 fontSize: 10,
                                 fontFamily: "Poppins_300Light",
                                 marginRight: 5,
                              }}>
                              {dateAgo(comment.createdAt)}
                           </Text>
                        )}

                        <Divider style={{ width: 50 }} />
                        <Button
                           disabled={loading}
                           labelStyle={{
                              fontFamily: "Poppins_300Light",
                              paddingHorizontal: 3,
                              fontSize: 13,
                              color: theme.colors.secondary,
                           }}
                           onPress={handleReplyModal}
                           mode="text">
                           Reply
                        </Button>
                        <Button
                           disabled={loading}
                           labelStyle={{
                              fontFamily: "Poppins_300Light",
                              paddingHorizontal: 3,
                              fontSize: 13,
                              color: theme.colors.secondary,
                           }}
                           onPress={() => setOpenRepliesModal(true)}>
                           <Ionicons
                              size= {props.size === "small" ? 14 : 15}
                              color={theme.colors.secondary}
                              name="chatbox-outline"
                           />
                           {repliesCount}
                        </Button>
                        <Button
                           disabled={loading}
                           labelStyle={{
                              fontFamily: "Poppins_300Light",
                              paddingHorizontal: 3,
                              fontSize: 13,
                              color: theme.colors.secondary,
                           }}
                           onPress={() => handleLike(comment.commentId)}>
                           <AntDesign
                              size={props.size === "small" ? 14 : 15}
                              name={liked ? "like1" : "like2"}
                              color={theme.colors.secondary}
                           />
                           {likesCount}
                        </Button>
                     </View>
                     {replies.length > 0 && (
                        <View>
                           <CommentComponent
                              comment={replies[0]}
                              blogOwnerId={props.blogOwnerId}
                           />
                        </View>
                     )}
                  </View>
               </View>
            </View>
         )}
      </KeyboardAvoidingView>
   );
};

export default CommentComponent;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#ffffff",
      marginVertical: 3,
   },
   profileImage: {
      width: 28,
      height: 28,
      borderRadius: 15,
   },
   commentorMedia: {
      flexDirection: "row",
      gap: 8,
   },
   userFullName: {
      fontFamily: "Poppins_400Regular",
   },
});
