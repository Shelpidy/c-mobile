import React, { useState, useCallback, useEffect } from "react";
import {
   Bubble,
   GiftedChat,
   Send,
   MessageText,
   InputToolbar,
   Composer,
   Actions,
} from "react-native-gifted-chat";
import { Button, Divider, IconButton, useTheme } from "react-native-paper";
import {
   View,
   Text,
   KeyboardAvoidingView,
   Platform,
   Alert,
   Image,
   Pressable,
   TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { io, Socket } from "socket.io-client";
import { StyleSheet } from "react-native";
import TextShortener from "../components/TextShortener";
import { useCurrentUser } from "../utils/CustomHooks";

type ChatBoxProps = {
   onSend: () => void;
   onTextInput: (v: string) => void;
};

const ChatBox = ({ onSend, onTextInput }: ChatBoxProps) => {
   const theme = useTheme();
   return (
      <View
         style={{
            paddingHorizontal: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
         }}>
         <TextInput
            placeholder="Type here..."
            onChangeText={(v) => onTextInput(v)}
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
            onPress={onSend}
            style={{
               paddingHorizontal: 20,
               height: 50,
               alignItems: "center",
               justifyContent: "center",
               borderTopRightRadius: 20,
               borderBottomRightRadius: 20,
               backgroundColor: "#f6f6f6",
            }}>
            <FontAwesome color={theme.colors.primary} name="send-o" size={23} />
         </Pressable>
      </View>
   );
};

const ChatScreen = ({ navigation, route }: any) => {
   const [messages, setMessages] = useState<IMessage[] | null>(null);
   const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
   const theme = useTheme();
   const [fileUri, setFileUri] = useState<any>(null);
   const [textValue, setTextValue] = useState<string>("");
   const [loading, setLoading] = useState<boolean>(true);
   const currentUser = useCurrentUser();
   const [secondUser, setSecondUser] = useState<User>();
   const [socket, setSocket] = useState<Socket | null>(null);

   const toggleEmojiPicker = () => {
      setShowEmojiPicker(!showEmojiPicker);
   };

   const generateRoomId = (secUserId: any, activeUserId: any) => {
      let maxId = Math.max(secUserId, activeUserId);
      let minId = Math.min(secUserId, activeUserId);
      return Number(`${maxId}${minId}`);
   };

   useEffect(() => {
      let secUser = route.params.user;
      console.log(secUser);
      setSecondUser(secUser);
   }, []);

   useEffect(() => {
      let secUser = route.params?.user.id;
      let activeUser = currentUser?.id;
      let roomId = generateRoomId(secUser, activeUser);
      let newSocket = io(`http://192.168.0.107:8080/?roomId=${roomId}`);
      setSocket(newSocket);

      // cleanup function to close the socket connection when the component unmounts
      return () => {
         newSocket.close();
      };
   }, [currentUser]);

   useEffect(() => {
      let secUser = route.params.user.id;

      let activeUser = currentUser?.id;
      let roomId = generateRoomId(secUser, activeUser);
      console.log(roomId);
      console.log("Socket connecting");

      if (socket) {
         socket.on("message", (msg: any) => {
            console.log("Message from the server", msg);
         });

         socket.on(String(roomId), (message: any) => {
            console.log("From Server", message);
            setMessages((previousMessages) => {
               if (previousMessages) {
                  return GiftedChat.append(previousMessages, message);
               }
               return GiftedChat.append([], message);
            });
         });
      }
   }, [socket, currentUser]);

   useEffect(() => {
      console.log("Fetching chats");
      let secUser = route.params.user.id;
      let activeUser = currentUser?.id;
      let roomId = generateRoomId(secUser, activeUser);

      let fetchData = async () => {
         try {
            let resp = await fetch(
               `http://192.168.0.107:8080/chats/${roomId}`,
               { method: "GET" }
            );
            let chatMessages = await resp.json();
            console.log("Chats Messages", chatMessages);
            setMessages(chatMessages.reverse());
         } catch (err) {
            console.log(err);
            Alert.alert("Failed", String(err));
            setLoading(false);
         }
      };
      fetchData();
   }, [currentUser]);

   const onSend = () => {
      let secUser = route.params.user.id;
      let activeUser = currentUser?.id;
      let roomId = generateRoomId(secUser, activeUser);
      let sendData = {
         senderId: route.params.user.id,
         receipientId: currentUser?.id,
         text: textValue,
         roomId: roomId,
      };
      console.log(sendData, roomId);
      setTextValue("");

      socket?.emit(String(roomId), sendData);
   };

   const handleEmojiSelect = (emoji: any) => {
      setTextValue(textValue + emoji);
   };

   const handleChatInput = (val: string) => {
      setTextValue(val);
   };

   const gotoUserProfile = () => {
      if (currentUser?.id === secondUser?.id) {
         navigation.navigate("ProfileScreen", { userId: secondUser?.id });
      } else {
         navigation.navigate("UserProfileScreen", { userId: secondUser?.id });
      }
   };

   if (!messages || !currentUser) {
      return (
         <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Loading...</Text>
         </View>
      );
   }
   return (
      <View style={{ flex: 1, marginBottom: 10 }}>
         <View>
            {secondUser && (
               <View
                  style={{
                     flexDirection: "row",
                     alignItems: "center",
                     paddingVertical: 10,
                     paddingLeft: 15,
                  }}>
                  <Pressable onPress={gotoUserProfile}>
                     <Image
                        style={styles.profileImage}
                        source={{ uri: secondUser.profileImage }}
                     />
                  </Pressable>
                  <View>
                     <TextShortener
                        style={{
                           fontFamily: "Poppins_500Medium",
                           marginHorizontal: 5,
                        }}
                        text={secondUser.fullName}
                        textLength={18}
                     />
                  </View>
               </View>
            )}
         </View>
         <Divider />
         <KeyboardAvoidingView style={{ flex: 1, marginBottom: 20 }}>
            <GiftedChat
               renderInputToolbar={() => (
                  <ChatBox
                     onSend={onSend}
                     onTextInput={(v) => setTextValue(v)}
                  />
               )}
               renderBubble={(props) => {
                  return (
                     <Bubble
                        {...props}
                        textStyle={{
                           right: { color: "#f9f9f9" },
                           left: { color: "#000" },
                        }}
                        wrapperStyle={{
                           left: {
                              backgroundColor: theme.colors.secondaryContainer, // set your desired background color here
                           },
                           right: {
                              backgroundColor: theme.colors.primary, // set your desired background color here
                           },
                        }}
                     />
                  );
               }}
               inverted
               messages={messages}
               user={{
                  _id: currentUser?.id,
               }}
            />
         </KeyboardAvoidingView>
      </View>
   );
};

export default ChatScreen;

const styles = StyleSheet.create({
   profileImage: {
      width: 30,
      height: 30,
      borderRadius: 15,
   },
});
