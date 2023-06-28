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
import Reply from "./Reply";
import { Skeleton } from "@rneui/themed";
import { dateAgo } from "../../utils/util";

type CommentProps = {
   comment: PostComment;
   repliesCount: number;
   likesCount: number;
   liked: boolean;
   user: User;
   posterId?: number;
};

type FetchReply = {
   reply: CommentReply;
   likesCount: number;
   liked: boolean;
   user: User;
};

const { height, width } = Dimensions.get("window");

const Comment = (props: CommentProps) => {
   const currentUser = useCurrentUser();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [openRepliesModal, setOpenRepliesModal] = useState<boolean>(false);
   const [commentor, setCommentor] = useState<User | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
   const [commentText, setCommentText] = useState<string>("");
   const [replyText, setReplyText] = useState<string>("");
   const [comment, setComment] = useState<PostComment>(props.comment);
   const [replies, setReplies] = useState<FetchReply[]>([]);
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
            let commentId = props.comment?.id;
            console.log(commentId, currentUser);
            let response = await fetch(
               `http://192.168.148.183:5000/api/media/posts/comments/${commentId}/replies/${currentUser?.id}/${pageNumber}/5`
            );
            let { data } = await response.json();
            if (response.ok) {
               setReplies((prev) => (prev ? [...prev, ...data] : data));
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
      <Reply
         key={String(item.reply.id)}
         posterId={props.posterId}
         reply={item.reply}
         user={item.user}
         likesCount={item.likesCount}
         liked={item.liked}
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
   useEffect(() => {
      setComment(props.comment);
      setCommentor(props.user);
      setLiked(props.liked);
      setLikesCount(props.likesCount);
      setRepliesCount(props.repliesCount);
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

      let activeUserId = currentUser?.id;
      let replyObj = {
         text: replyText,
         commentId: props.comment.id,
         userId: activeUserId,
      };
      console.log("ReplyObj", replyObj);
      try {
         let { data } = await axios.post(
            `http://192.168.148.183:5000/api/media/posts/comments/replies/`,
            replyObj
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

   const handleLike = async (commentId?: number) => {
      console.log(commentId);
      if (commentId) {
         try {
            setLoading(true);
            let activeUserId = currentUser?.id;
            let { data } = await axios.put(
               `http://192.168.148.183:5000/api/media/posts/comments/likes/`,
               { userId: activeUserId, commentId: commentId }
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
      }
   };

   const handleUpdateComment = () => {
      setLoading(true);
      async function UpdateComment() {
         try {
            let putObj = { text: commentText, id: comment?.id };
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
      if (currentUser?.id === commentor?.id) {
         navigation.navigate("ProfileScreen", { userId: commentor?.id });
      } else {
         navigation.navigate("UserProfileScreen", { userId: commentor?.id });
      }
   };

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
                     keyExtractor={(item) => String(item?.reply?.id)}
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
                        size={35}
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
                           style={styles.userFullName}
                           textLength={24}
                           text={
                              commentor.firstName +
                              "" +
                              commentor.middleName +
                              " " +
                              commentor.lastName
                           }
                        />
                        {(currentUser?.id == commentor.id ||
                           currentUser?.id == props?.posterId) && (
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
                           fontSize: 13,
                           color: theme.colors.secondary,
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
                              size={15}
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
                           onPress={() => handleLike(comment.id)}>
                           <AntDesign
                              size={15}
                              name={liked ? "like1" : "like2"}
                              color={theme.colors.secondary}
                           />
                           {likesCount}
                        </Button>
                     </View>
                     {replies.length > 0 && (
                        <View>
                           <Reply
                              size="small"
                              posterId={props.posterId}
                              likesCount={replies[0].likesCount}
                              liked={replies[0].liked}
                              reply={replies[0].reply}
                              user={replies[0].user}
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

export default Comment;

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
