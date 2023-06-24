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
} from "react-native";
import React, { useEffect, useState } from "react";
import { users } from "../../data";
import {
   Feather,
   SimpleLineIcons,
   FontAwesome,
   AntDesign,
   EvilIcons,
} from "@expo/vector-icons";
import { Avatar, Button, Divider, useTheme } from "react-native-paper";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useCurrentUser } from "../../utils/CustomHooks";
import TextShortener from "../TextShortener";

type ReplyProps = {
   reply: CommentReply;
   likesCount: number;
   liked: boolean;
   user: User;
   posterId?: number;
   size?: "normal" | "small";
};

const Reply = (props: ReplyProps) => {
   const currentUser = useCurrentUser();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [openRepliesModal, setOpenRepliesModal] = useState<boolean>(false);
   const [commentor, setCommentor] = useState<User | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const [replyText, setreplyText] = useState<string>("");
   const [reply, setReply] = useState<CommentReply>(props.reply);
   const [likesCount, setLikesCount] = useState<number>(0);
   const [liked, setLiked] = useState<boolean>(false);

   const theme = useTheme();

   const navigation = useNavigation<any>();

   useEffect(() => {
      setReply(props.reply);
      setCommentor(props.user);
      setLiked(props.liked);
      setLikesCount(props.likesCount);
   }, []);

   const handleLike = async (replyId?: number) => {
      console.log(replyId);
      if (replyId) {
         try {
            setLoading(true);
            let activeUserId = currentUser?.id;
            let { data } = await axios.put(
               `http://192.168.182.183:5000/api/media/posts/comments/replies/likes/`,
               { userId: activeUserId, replyId: replyId }
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

   const handleUpdateReply = () => {
      setLoading(true);
      async function UpdateComment() {
         try {
            let putObj = { text: replyText, id: reply?.id };
            let response = await axios.put(
               "`http://192.168.182.183:5000/media/posts/comments/replies",
               putObj
            );
            if (response.status == 202) {
               setReply({ ...reply, text: replyText });
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
      <View style={styles.container}>
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
                        Update Reply
                     </Text>
                  </View>
                  <View
                     style={{
                        paddingHorizontal: 15,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                     }}>
                     <TextInput
                        value={replyText}
                        placeholder="Comment here..."
                        onChangeText={(v) => setreplyText(v)}
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
                        onPress={handleUpdateReply}
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
                           size={23}
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
                        paddingHorizontal: 5,
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
                           textLength={22}
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
                           fontSize: props.size === "small" ? 11 : 13,
                        }}>
                        {reply?.text}
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
                           gap: 15,
                        }}>
                        <Divider style={{ width: 100 }} />
                        <TouchableHighlight
                           onPress={() => handleLike(reply.id)}>
                           <View
                              style={{
                                 flexDirection: "row",
                                 justifyContent: "flex-start",
                                 alignItems: "center",
                              }}>
                              <AntDesign
                                 size={18}
                                 name={liked ? "like1" : "like2"}
                              />
                              <Text
                                 style={{
                                    fontFamily: "Poppins_300Light",
                                    paddingHorizontal: 3,
                                    fontSize: 13,
                                 }}>
                                 {likesCount}
                              </Text>
                           </View>
                        </TouchableHighlight>
                     </View>
                  </View>
               </View>
            </View>
         )}
      </View>
   );
};

export default Reply;

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
